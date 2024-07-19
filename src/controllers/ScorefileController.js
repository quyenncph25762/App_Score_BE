import { message } from "antd";
import Employee from "../models/Employee";
import ScorefileModle from "../models/Scorefile";
import jwt from "jsonwebtoken";
class ScorefileController {
  getScorefile_ByEmployeeId(req, res) {
    let token = req.cookies.Countryside;
    let par = jwt.verify(token, process.env.SECRET);
    let id = par._id;
    ScorefileModle.getScorefile_ByEmployee(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  create_Scorefile(req, res) {
    let token = req.cookies.Countryside;
    let par = jwt.verify(token, process.env.SECRET);
    let id = par._id;
    const form = { EmployeeId: id, ...req.body };
    ScorefileModle.createScorefile(form, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({
          message: "Tạo phiếu thành công",
        });
      }
    });
  }
  update_Scorefile(req, res) {
    const id = req.params.id;
    ScorefileModle.updateScorefile(id, req.body, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({
          message: "Cập nhật phiếu thành công",
        });
      }
    });
  }
  
}
export default new ScorefileController();
