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
  getOne_Scorefile(req, res) {
    let token = req.cookies.Countryside;
    let par = jwt.verify(token, process.env.SECRET);
    let idEmployee = par._id;
    const id = req.params.id;
    ScorefileModle.getOneScorefile_ByEmployee(
      id,
      idEmployee,
      (err, results) => {
        if (err) {
          console.log("Error", err);
        } else {
          const data = {
            EmployeeId: results[0].EmployeeId,
            ScoreTempId: results[0].ScoreTempId,
            Code: results[0].Code,
            Score: results[0].Score,
            Status: results[0].Status,
            IsActive: results[0].IsActive,
            listScoreFileDetail: [],
          };
          const Scorefile = new Map();
          results.forEach((element) => {
            Scorefile.set(element.IdScorefile_Detail, {
              IdScorefile_Detail: element.IdScorefile_Detail,
              CriteriaDetailId: element.CriteriaDetailId,
              TypePercentValue: element.TypePercentValue,
              TypeTotalValue: element.TypeTotalValue,
              CurrentStatusValue: element.CurrentStatusValue,
            });
          });
          data.listScoreFileDetail = Array.from(Scorefile.values());
          res.status(200).json(data);
        }
      }
    );
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
    let token = req.cookies.Countryside;
    let par = jwt.verify(token, process.env.SECRET);
    let idEmployee = par._id;
    const listScoreFileDetail = req.body.listScoreFileDetail;
    ScorefileModle.deleteScorefile_Detail(id, (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        ScorefileModle.updateScorefile(id, req.body, async (err, results) => {
          if (err) {
            console.log("Error", err);
          } else {
            try {
              if (listScoreFileDetail) {
                for (const item of listScoreFileDetail) {
                  const forms = {
                    ScorefileId: id,
                    CriteriaDetailId: item.CriteriaDetailId,
                    EmployeeId: idEmployee,
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
                message: "cập nhật phiếu thành công",
              });
            } catch (error) {
              console.log("Error", error);
              res.status(500).json({ message: "Internal Server Error" });
            }
          }
        });
      }
    });
  }
  deleteOne_Scorefile(req, res) {
    const id = req.params.id;
    ScorefileModle.deleteScorefile(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json("Xóa thành công");
      }
    });
  }
  delete_selected_Scorefile(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    ScorefileModle.deleteScorefile(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json("Xóa thành công");
      }
    });
  }
  restoreOne_Scorefile(req, res) {
    const id = req.params.id;
    ScorefileModle.restoreScorefile(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json("Khôi phục thành công");
      }
    });
  }
  restore_selected_Scorefile(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    ScorefileModle.restoreScorefile(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json("Khôi phục thành công");
      }
    });
  }
}
export default new ScorefileController();
