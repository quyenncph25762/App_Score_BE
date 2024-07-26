import Employee from "../models/Employee";
import ScorefileModle from "../models/Scorefile";
import Scoretemp from "../models/Scoretemp";
import generateRandomString from "../middlewares/generate";
import jwt from "jsonwebtoken";
import { message } from "antd";
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
    const { EmployeeId, YearId, ObjectId } = req.body;

    const ListScoreTempIds = [];
    const ListScoreTempIdsToRemove = [];
    const ListdataIds = [];
    // kiểm tra xem phiếu đã có chưa ?
    Scoretemp.getScoreTemp_YearAndObject_to_get_id(
      ObjectId,
      YearId,
      async (err, datas) => {
        if (err) {
          console.log(err);
        } else {
          datas.map((data) => {
            ListdataIds.push(data._id);
          });

          for (const scoretempId of ListdataIds) {
            const dataScorefile = await new Promise((resolve, reject) => {
              // kiểm tra xem scorefile đã có chưa
              ScorefileModle.getScorefile_ScoreTempId_EmployeeId_YearId(
                scoretempId,
                EmployeeId,
                YearId,
                (err, scorefile) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(scorefile);
                  }
                }
              );
            });
            if (dataScorefile.length === 1) {
              ListScoreTempIdsToRemove.push(scoretempId);
            } else if (dataScorefile.length === 0) {
              //chưa có push vào mảng
              ListScoreTempIds.push(scoretempId);
            }
          }
          ScorefileModle.deleteScorefile_ScoretempId_EmployeeId_YearId(
            ListScoreTempIdsToRemove,
            EmployeeId,
            YearId,
            (err, results) => {
              if (err) {
                console.log("Error", err);
              } else {
                res.json({ message: "Phát phiếu thành công" });
              }
            }
          );
          // kiểm tra nếu như mảng id đã có được tạo hết chưa
          if (ListScoreTempIds.length === 0) {
            res.json({
              message: "Các phiếu đã được phát rồi !",
            });
          } else {
            Scoretemp.getObjectId_scoretempIdAndYearId(
              ListScoreTempIds,
              YearId,
              (err, objectIds) => {
                if (err) {
                  console.log(err);
                } else {
                  // lấy danh sách các object chưa được tạo
                  const ListObjectId = [];
                  objectIds.map((item) => {
                    ListObjectId.push(item.ObjectId);
                  });
                  // lấy phiếu theo object để tạo scorefile
                  Scoretemp.getOneScoretemp_to_YearAndObject(
                    ListObjectId,
                    YearId,
                    async (err, results) => {
                      if (err) {
                        console.log("Error", err);
                      } else {
                        try {
                          const data = {
                            scorefile: [],
                          };
                          const ScorefileMap = new Map();
                          results.map(async (item) => {
                            if (!ScorefileMap.has(item._id)) {
                              ScorefileMap.set(item._id, {
                                ScoreTempId: item._id,
                                EmployeeId: EmployeeId,
                                Code: generateRandomString(8),
                                YearId: YearId,
                                listScoreFileDetail: [],
                              });
                            }
                            const scorefileDetail = ScorefileMap.get(item._id);
                            scorefileDetail.listScoreFileDetail.push({
                              CriteriaDetailId: item.ScoretempDetail_id,
                              EmployeeId: EmployeeId,
                            });
                          });
                          data.scorefile = Array.from(ScorefileMap.values());
                          //danh sách phát phiếu
                          const ListData = data.scorefile;

                          // tạo phiếu
                          for (const element of ListData) {
                            const form = {
                              EmployeeId: element.EmployeeId,
                              ScoreTempId: element.ScoreTempId,
                              YearId: element.YearId,
                              Code: element.Code,
                            };
                            // tạo scorefile
                            const dataScorefile = await new Promise(
                              (resolve, reject) => {
                                ScorefileModle.createScorefile(
                                  form,
                                  (err, results) => {
                                    if (err) {
                                      reject(err);
                                    } else {
                                      resolve(results);
                                    }
                                  }
                                );
                              }
                            );
                            // lấy id của scorefile
                            const ScorefileId = dataScorefile.insertId;
                            if (element.listScoreFileDetail) {
                              for (const item of element.listScoreFileDetail) {
                                const forms = {
                                  ScorefileId: ScorefileId,
                                  CriteriaDetailId: item.CriteriaDetailId,
                                  EmployeeId: item.EmployeeId,
                                };
                                await new Promise((resolve, reject) => {
                                  ScorefileModle.creatScoreFile_Detail(
                                    forms,
                                    (err, data) => {
                                      if (err) {
                                        reject(err);
                                      } else {
                                        resolve(data);
                                      }
                                    }
                                  );
                                });
                              }
                            }
                          }
                          res.status(200).json({
                            message: "Phát phiếu thành công",
                          });
                        } catch (error) {
                          console.log("Error", error);
                        }
                      }
                    }
                  );
                }
              }
            );
          }

          // tạo scorefile từ danh sách
        }
      }
    );
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
