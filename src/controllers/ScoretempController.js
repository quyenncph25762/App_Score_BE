import Scoretemp from "../models/Scoretemp";
import CriteriaModle from "../models/Criteria";
class ScoretempController {
  getAllScoretemp(req, res) {
    Scoretemp.getAllScoretemp((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  //
  getOneScoretemp(req, res) {
    const id = req.params.id;
    Scoretemp.getOneScoretemp(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        const data = results[0];
        res.status(200).json(data);
      }
    });
  }
  // create
  createScoretemp(req, res) {
    const Criteria = req.body.Criteria;
    Scoretemp.createScoretemp(req.body, async (err, results) => {
      if (err) {
        console.log("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
      const ScoreTempId = results.insertId;
      try {
        if (Criteria) {
          for (const criteria of Criteria) {
            const form = {
              ScoreTempId: ScoreTempId,
              Name: criteria.Name,
              FieldId: criteria.FieldId,
            };
            const data = await new Promise((resolve, reject) => {
              CriteriaModle.createCriteria(form, (err, data) => {
                if (err) {
                  reject(err);
                } else {
                  resolve(data);
                }
              });
            });
            const CriteriaId = data.insertId;
            if (criteria.listCriteria) {
              for (const detail of criteria.listCriteria) {
                const formDetail = {
                  Name: detail.Name,
                  CriteriaId: CriteriaId,
                 
                  Score: detail.Score,
                  Target: detail.Target,
                  IsTypePercent: detail.IsTypePercent,
                  IsTypeTotal: detail.IsTypeTotal,
                  IsCurrentStatusType: detail.IsCurrentStatusType,
                  TypePercentValue: detail.TypePercentValue,
                  TypeTotalValue: detail.TypeTotalValue,
                  CurrentStatusValue: detail.CurrentStatusValue,
                };
                await new Promise((resolve, reject) => {
                  CriteriaModle.createDetailCriteria(
                    formDetail,
                    (err, results) => {
                      if (err) {
                        reject(err);
                      } else {
                        resolve(results);
                      }
                    }
                  );
                });
              }
            }
          }
        }
        res.status(200).json({ message: "Thêm phiếu thành công" });
      } catch (error) {
        console.log("Error", error);
        res.status(500).json({ message: "Internal Server Error" });
      }
    });
  }

  updateScoretemp(req, res) {
    const id = req.params.id;
    const Criteria = req.body.Criteria;
    CriteriaModle.deleteCriteria(id, (err, results) => {
      if (err) {
        console.log("Error", err);
        res.status(500).json({ message: "Internal Server Error" });
        return;
      }
      Scoretemp.updateScoretemp(id, req.body, async (err, results) => {
        if (err) {
          console.log("Error", err);
          res.status(500).json({ message: "Internal Server Error" });
          return;
        }
        try {
          if (Criteria) {
            for (const criteria of Criteria) {
              const form = {
                ScoreTempId: id,
                Name: criteria.Name,
                FieldId: criteria.FieldId,
              };
              const data = await new Promise((resolve, reject) => {
                CriteriaModle.createCriteria(form, (err, data) => {
                  if (err) {
                    reject(err);
                  } else {
                    resolve(data);
                  }
                });
              });
              const CriteriaId = data.insertId;
              if (criteria.listCriteria) {
                for (const detail of criteria.listCriteria) {
                  const formDetail = {
                    Name: detail.Name,
                    CriteriaId: CriteriaId,
                   
                    Score: detail.Score,
                    Target: detail.Target,
                    IsTypePercent: detail.IsTypePercent,
                    IsTypeTotal: detail.IsTypeTotal,
                    IsCurrentStatusType: detail.IsCurrentStatusType,
                    TypePercentValue: detail.TypePercentValue,
                    TypeTotalValue: detail.TypeTotalValue,
                    CurrentStatusValue: detail.CurrentStatusValue,
                  };
                  await new Promise((resolve, reject) => {
                    CriteriaModle.createDetailCriteria(
                      formDetail,
                      (err, results) => {
                        if (err) {
                          reject(err);
                        } else {
                          resolve(results);
                        }
                      }
                    );
                  });
                }
              }
            }
          }
          res.status(200).json({ message: "Thêm phiếu thành công" });
        } catch (error) {
          console.log("Error", error);
          res.status(500).json({ message: "Internal Server Error" });
        }
      });
    });
  }
  deleteAll_Selected(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    Scoretemp.deleteScoretemp(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ message: "Xoá phiếu thành công" });
      }
    });
  }
  deleteOne_Scoretemp(req, res) {
    const id = req.params.id;
    Scoretemp.deleteScoretemp(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ message: "Xoá phiếu thành công" });
      }
    });
  }
  restoreAll_Selected(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    Scoretemp.restoreScoretemp(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ message: "Khôi phục phiếu thành công" });
      }
    });
  }
  restoreOne_Scoretemp(req, res) {
    const id = req.params.id;
    Scoretemp.restoreScoretemp(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({ message: "Khôi phục phiếu thành công" });
      }
    });
  }
}
export default new ScoretempController();
