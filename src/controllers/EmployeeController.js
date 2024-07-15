import jwt from "jsonwebtoken";
import Employee from "../models/Employee";

class EmployeeController {
  login(req, res) {
    const UserName = req.body.UserName;
    const PassWord = req.body.PassWord;
    const DistrictId = req.body.DistrictId;
    Employee.getOneEmloyee(UserName, PassWord, DistrictId, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        if (results.length === 1) {
          console.log(process.env.SECRET);
          const data = results[0];
          const token = jwt.sign({ _id: data._id }, process.env.SECRET);
          res.status(200).json({
            messager: "Đăng nhập thành công",
            token: token,
          });
        } else {
          res.json({
            messager: "Đăng nhập thất bại",
          });
        }
      }
    });
  }
  getAll(req, res) {
    Employee.getAllEmployee((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({
          messager: "Get all data ",
          data: results,
        });
      }
    });
  }
  createEmployee(req, res) {
    const Email = req.body.Email;
    const UserName = req.body.UserName;
    Employee.getEmployeeBy_EmailAndUserName(Email, UserName, (err, data) => {
      if (err) {
        console.log("Error", err);
      } else {
        if (data.length > 0) {
          res.json({
            messager: "Email hoặc tên đăng nhập đã tồn tại",
          });
        } else {
          Employee.createEmployee(req.body, (err, results) => {
            if (err) {
              console.log("Error", err);
            } else {
              res.status(200).json({
                messager: "Thêm tài khoản thành công",
              });
            }
          });
        }
      }
    });
  }
  updateEmployee(req, res) {
    const id = req.params.id;
    Employee.updateEmployee(id, req.body, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({
          messager: "Chỉnh sửa thành công",
        });
      }
    });
  }
}
export default new EmployeeController();
