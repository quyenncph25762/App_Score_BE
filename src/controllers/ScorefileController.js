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
    const listScoreFileDetail = req.body.listScoreFileDetail;
    ScorefileModle.createScorefile(form, async (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        try {
          const ScorefileId = results.insertId;
          if (listScoreFileDetail) {
            for (const item of listScoreFileDetail) {
              const forms = {
                ScorefileId: ScorefileId,
                CriteriaDetailId: item.CriteriaDetailId,
                EmployeeId: id,
                TypePercentValue: item.TypePercentValue,
                TypeTotalValue: item.TypeTotalValue,
                CurrentStatusValue: item.CurrentStatusValue,
              };
              await new Promise((resolve, reject) => {
                ScorefileModle.creatScoreFile_Detail(forms, (err, data) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(data);
                  }
                });
              });
            }
          }
          res.status(200).json({
            message: "Tạo phiếu thành công",
          });
        } catch (error) {
          console.log("Error", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
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
