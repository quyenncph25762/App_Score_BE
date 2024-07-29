import Employee from "../models/Employee";
import ScorefileModle from "../models/Scorefile";
import Scoretemp from "../models/Scoretemp";
import Criteria from "../models/Criteria";
import generateRandomString from "../middlewares/generate";
import jwt from "jsonwebtoken";
import { message } from "antd";
class ScorefileController {
  // lấy những phiếu chờ duyệt
  getScorefile_ByEmployeeId_Inactive(req, res) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let id = par._id;
    ScorefileModle.getScorefile_ByEmployee_Inactive(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  // lấy những phiếu đã duyệt
  getScorefile_ByEmployeeId_ActiveNow(req, res) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let id = par._id;
    ScorefileModle.getScorefile_ByEmployee_ActiveNow(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  // lấy tất cả phiếu
  getScorefile_ByEmployeeId(req, res) {
    let token = req.cookies[process.env.COOKIE];
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
  // xem chi tiết phiếu theo xã
  getOne_Scorefile(req, res) {
    let token = req.cookies[process.env.COOKIE];
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
          if (results.length > 0) {
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
          } else {
            res.status(400).json({ message: "Phiếu chưa được xác nhận" });
          }
        }
      }
    );
  }
  // chi tiết phiếu theo Employee và Field
  getOne_Scorefile_ByEmployeeAndField(req, res) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let idEmployee = par._id;
    const idScorefile = req.params.id;
    //từ employee -> fieldId
    Employee.getAll_FieldEmployee(idEmployee, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        const FieldId = [];
        results.map((item) => {
          FieldId.push(item.FieldId);
        });
        //từ scorefile ->scoretemp
        ScorefileModle.getScoreTempId_IdScorefile(
          idScorefile,
          (err, scorefile) => {
            if (err) {
              console.log("Error", err);
            } else {
              const ScoreTempId = scorefile[0].ScoreTempId;
              // từ criteria -> id criteria
              Criteria.getCiteria_ByScoreTemId_FieldId(
                ScoreTempId,
                FieldId,
                (err, criteria) => {
                  if (err) {
                    console.log("Error", err);
                  } else {
                    const CriteriaId = [];
                    criteria.map((item) => {
                      CriteriaId.push(item._id);
                    });
                    // lấy dc Id_criteriaDetail
                    if (CriteriaId) {
                      Criteria.getDetailCriteria_ScorefileDetail_ByCriteriaId(
                        idScorefile,
                        CriteriaId,
                        idEmployee,
                        (err, results) => {
                          if (err) {
                            console.log("Error", err);
                          } else {
                            let data = {
                              ScorefileId: idScorefile,
                              NameScoreTemp: scorefile[0].NameScoreTemp,
                              Criteria: [],
                            };
                            const CriteriaMap = new Map();
                            results.forEach((element) => {
                              if (!CriteriaMap.has(element.IdCriteria)) {
                                CriteriaMap.set(element.IdCriteria, {
                                  _id: element._id,
                                  Name: element.NameCriteria,
                                  IsTypePercent: element.IsTypePercent,
                                  IsTypeTotal: element.IsTypeTotal,
                                  IsCurrentStatusType:
                                    element.IsCurrentStatusType,
                                  listCriteria: [],
                                });
                              }
                              const getCriteriatoMap = CriteriaMap.get(
                                element.IdCriteria
                              );
                              getCriteriatoMap.listCriteria.push({
                                _id: element.IdScoreFile_Detail,
                                Name: element.Name,
                                TypePercentValue: element.TypePercentValue,
                                TypeTotalValue: element.TypeTotalValue,
                                CurrentStatusValue: element.CurrentStatusValue,
                              });
                            });
                            data.Criteria = Array.from(CriteriaMap.values());
                            res.status(200).json(data);
                          }
                        }
                      );
                    } else {
                      res
                        .status(500)
                        .json({
                          message:
                            "Phiếu này không có lĩnh vực phù hợp với tài khoản",
                        });
                    }
                  }
                }
              );
            }
          }
        );
      }
    });
  }
  create_Scorefile(req, res) {
    const { EmployeeId, YearId, ObjectId } = req.body;
    // danh sách tạo ssorefile
    const ListScoreTempIds = [];
    // xóa những scorefile k có trong mảng
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
          // xóa những scorefile k được nhận
          ScorefileModle.deleteScorefile_ScoretempId_EmployeeId_YearId(
            ListScoreTempIdsToRemove,
            EmployeeId,
            YearId,
            (err, results) => {
              if (err) {
                console.log("Error", err);
              } else {
                res.status(200).json({ message: "Phát phiếu thành công" });
              }
            }
          );
          // kiểm tra nếu như mảng id đã có được tạo hết chưa
          if (ListScoreTempIds.length === 0) {
            res.status(400).json({
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
        }
      }
    );
  }
  // update active
  update_ActiveScorefile(req, res) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let idEmployee = par._id;
    const id = req.params.id;
    ScorefileModle.update_ActiveScorefile(id, idEmployee, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ message: "Duyệt phiếu thành công" });
      }
    });
  }
  // chấm điểm
  update_Scorefile(req, res) {
    const id = req.params.id;
    let token = req.cookies[process.env.COOKIE];
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
