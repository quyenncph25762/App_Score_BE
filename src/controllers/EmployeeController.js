import jwt from "jsonwebtoken";
import Employee from "../models/Employee";

class EmployeeController {
  login(req, res) {
    const UserName = req.body.UserName;
    const PassWord = req.body.Password;
    Employee.getOneEmloyee(UserName, PassWord, (err, results) => {
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
  getOneById(req, res) {
    const id = req.params.id;
    Employee.getOneEmployeeById(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        const data = results[0];
        res.status(200).json(data);
      }
    });
  }
  // lấy tài khoản theo tình
  getAll(req, res) {
    const searchName = req.query.searchName || "";
    const page = parseInt(req.query.page) || 1; // Trang hiện tại
    const pageSize = 10; // Kích thước trang
    const startIndex = (page - 1) * pageSize;
    const endIndex = page * pageSize;
    Employee.getAllEmployee(searchName, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
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
      }
    });
  }
  getAll_FieldEmployee(req, res) {
    const id = req.params.id;

    Employee.getAll_FieldEmployee(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  createEmployee(req, res) {
    const Email = req.body.Email;
    const UserName = req.body.UserName;
    const FieldIds = req.body.Fields;

    Employee.getEmployeeBy_EmailAndUserName(Email, UserName, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        if (data.length > 0) {
          res.status(400).json({
            messager: "Email hoặc tên đăng nhập đã tồn tại",
          });
        } else {
          Employee.createEmployee(req.body, (err, results) => {
            if (err) {
              console.log("Error", err);
            } else {
              const EmployeeId = results.insertId;
              if (FieldIds) {
                const Fields = FieldIds.map((id) => {
                  const forms = {
                    EmployeeId: EmployeeId,
                    FieldId: id,
                  };
                  return new Promise((resolve, reject) => {
                    Employee.createField_Employee(forms, (err, data) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(data);
                      }
                    });
                  });
                });
                Promise.all(Fields)
                  .then(() => {
                    res.status(200).json({
                      messager: "Thêm tài khoản thành công",
                    });
                  })
                  .catch((err) => {
                    console.log("Error", err);
                  });
              } else {
                res.status(200).json({
                  messager: "Thêm tài khoản thành công",
                });
              }
            }
          });
        }
      }
    });
  }
  async updateEmployee(req, res) {
    const EmployeeId = req.params.id;
    const FieldIds = req.body.Fields;
    try {
      await Employee.deleteField_Employee(EmployeeId);

      const updateData = { ...req.body, EmployeeId };
      console.log(updateData);
      await Employee.updateEmployee(EmployeeId, updateData);

      // Process FieldIds if it exists
      if (FieldIds && FieldIds.length > 0) {
        const fieldPromises = FieldIds.map((id) => {
          const forms = { EmployeeId, FieldId: id };
          return new Promise((resolve, reject) => {
            Employee.createField_Employee(forms, (err, data) => {
              if (err) {
                reject(err);
              } else {
                resolve(data);
              }
            });
          });
        });

        await Promise.all(fieldPromises);
      }
      res.status(200).json({
        message: "Chỉnh sửa tài khoản thành công",
      });
    } catch (err) {
      console.log("Error", err);
      res.status(500).json({
        message: "Lỗi chỉnh sửa tài khoản",
      });
    }
  }

  deleteOneEmployee(req, res) {
    const id = req.params.id;
    Employee.deleteEmloyee(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ messager: "Xóa Role thành công" });
      }
    });
  }
  deleteAllSelected_Employee(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    Employee.deleteEmloyee(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ messager: "Xóa Role thành công" });
      }
    });
  }
}
export default new EmployeeController();
