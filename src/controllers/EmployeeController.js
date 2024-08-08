import jwt from "jsonwebtoken";
import EmployeeModle from "../models/Employee";

class EmployeeController {
  login(req, res) {
    const UserName = req.body.UserName;
    const PassWord = req.body.Password;
    EmployeeModle.getOneEmloyee(UserName, PassWord, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        if (results.length > 0) {
          const data = results[0];
          const token = jwt.sign({ _id: data._id }, process.env.SECRET);
          res.cookie(process.env.COOKIE, token, {
            httpOnly: true,
            secure: false,
          });
          res.status(200).json({
            name: data.FullName,
            customer: data.Customer,
            roleId: data.RoleId,
            avatar: data.Avatar,
            token: token,
          });
        } else {
          res.status(400).json({
            messager: "Đăng nhập thất bại",
          });
        }
      }
    });
  }
  async getOneById(req, res) {
    const id = req.params.id;
    try {
      const results = await EmployeeModle.getOneEmployeeById(id);
      const data = results[0];
      res.status(200).json(data);
    } catch (error) {
      console.log("Error", error);
    }
  }
  // lấy tất cả các employee
  async getAll(req, res) {
    const searchName = req.query.searchName || "";
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const pageSize = 12; // Kích thước trang
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    try {
      const data = await EmployeeModle.getAllEmployee(searchName);
      const totalPages = Math.ceil(data.length / pageSize);
      const pages = Array.from({ length: totalPages }, (_, index) => {
        return {
          number: index + 1,
          active: index + 1 === page,
          isDots: index + 1 > 5,
        };
      });
      const paginatedData = data.slice(startIndex, endIndex);
      const views = {
        results: paginatedData,
        pagination: {
          prev: page > 1 ? page - 1 : null,
          next: endIndex < data.length ? page + 1 : null,
          pages: pages,
        },
      };
      res.status(200).json(views);
    } catch (error) {
      console.log("Error", error);
    }
  }
  // lấy các employee để phát phiếu chấm
  async getEmployeeToCreateScorefile(req, res) {
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const pageSize = 12; // Kích thước trang
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let idEmployee = par._id;

    try {
      var ListEmployee;
      const OneEmployee = await EmployeeModle.getOneEmployeeById(idEmployee);
      const RoleId = OneEmployee[0]?.RoleId;
      const CityId = OneEmployee[0]?.CityId;
      const DistrictId = OneEmployee[0]?.DistrictId;
      const ApartmentId = OneEmployee[0]?.ApartmentId;
      // nếu là Admin huyện
      if (RoleId == 1 && ApartmentId == 2) {
        ListEmployee = await EmployeeModle.getAdminWard_By_AdminDistrict(
          DistrictId
        );
      }
      // nếu là admin tỉnh
      else if (RoleId == 1 && ApartmentId == 1) {
        ListEmployee = await EmployeeModle.getAdminDistrict_By_AdminCity(
          CityId
        );
      } else if (RoleId == 1 && CityId == null) {
        ListEmployee = await EmployeeModle.getAdminCity_By_Manager();
      }
      const totalPages = Math.ceil(ListEmployee.length / pageSize);
      const pages = Array.from({ length: totalPages }, (_, index) => {
        return {
          number: index + 1,
          active: index + 1 === page,
          isDots: index + 1 > 5,
        };
      });
      const paginatedData = ListEmployee.slice(startIndex, endIndex);
      const views = {
        results: paginatedData,
        pagination: {
          prev: page > 1 ? page - 1 : null,
          next: endIndex < ListEmployee.length ? page + 1 : null,
          pages: pages,
        },
      };
      res.status(200).json(views);
    } catch (error) {
      console.log("Error", error);
    }
  }
  async getAll_FieldEmployee(req, res) {
    const id = req.params.id;
    try {
      const results = await EmployeeModle.getAll_FieldEmployee(id);
      res.status(200).json(results);
    } catch (error) {
      console.log("Error", error);
    }
  }
  async trashEmployee(req, res) {
    try {
      const data = await EmployeeModle.trashEmployee();
      res.status(200).json(data);
    } catch (error) {
      console.log("Error", error);
    }
  }
  async createEmployee(req, res) {
    const Email = req.body.Email;
    const UserName = req.body.UserName;
    const FieldIds = req.body.Fields;
    try {
      const data = await EmployeeModle.getEmployeeBy_EmailAndUserName(
        Email,
        UserName
      );
      if (data.length > 0) {
        res.status(400).json({
          messager: "Email hoặc tên đăng nhập đã tồn tại",
        });
      } else {
        const results = await EmployeeModle.createEmployee(req.body);
        const EmployeeId = results.insertId;
        if (FieldIds) {
          for (const id of FieldIds) {
            const forms = {
              EmployeeId: EmployeeId,
              FieldId: id,
            };
            await EmployeeModle.createField_Employee(forms);
          }
        }
        res.status(200).json({ message: "Tạo tài khoản thành công" });
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
  async updateEmployee(req, res) {
    const EmployeeId = req.params.id;
    const FieldIds = req.body.Fields;
    try {
      await EmployeeModle.deleteField_Employee(EmployeeId);
      const updateData = { ...req.body, EmployeeId };
      await EmployeeModle.updateEmployee(EmployeeId, updateData);

      // Process FieldIds if it exists
      if (FieldIds && FieldIds.length > 0) {
        FieldIds.map(async (id) => {
          const forms = { EmployeeId, FieldId: id };
          await EmployeeModle.createField_Employee(forms);
        });
      }
      return res.status(200).json({
        message: "Chỉnh sửa tài khoản thành công",
      });
    } catch (err) {
      console.log("Error", err);
    }
  }
  restoreOneEmployee(req, res) {
    const id = req.params.id;
    EmployeeModle.restoreEmloyee(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ messager: "Khôi phục tài khoản thành công" });
      }
    });
  }
  restoreAllSelected_Employee(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    EmployeeModle.restoreEmloyee(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ messager: "Khôi tài khoản thành công" });
      }
    });
  }
  deleteOneEmployee(req, res) {
    const id = req.params.id;
    EmployeeModle.deleteEmloyee(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ messager: "Xóa tài khoản thành công" });
      }
    });
  }
  deleteAllSelected_Employee(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    EmployeeModle.deleteEmloyee(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ messager: "Xóa tài khoản thành công" });
      }
    });
  }
}
export default new EmployeeController();
