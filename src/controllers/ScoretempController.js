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
    const id = parseInt(req.params.id);
    Scoretemp.getOneScoretemp(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        const scoretemp = {
          _id: id,
          Code: results[0].Code,
          Name: results[0].NameScoretemp,
          IsActive: results[0].IsActive,
          Description: results[0].Description,
          NameYear: results[0].NameYear,
          NameObject: results[0].NameObject,
          ObjectId: results[0].ObjectId,
          YearId: results[0].YearId,
          Criteria: [],
        };
        const CriteriaMap = new Map();
        results.forEach((element) => {
          if (!CriteriaMap.has(element.Criteria_id)) {
            CriteriaMap.set(element.Criteria_id, {
              _id: element.Criteria_id,
              Name: element.NameCriteria,
              FieldId: element.FieldId,
              listCriteria: [],
            });
          }
          const criteria = CriteriaMap.get(element.Criteria_id);
          criteria.listCriteria.push({
            _id: element.ScoretempDetail_id,
            Name: element.NameCriteriaDetail,
            Score: element.Score,
            Target: element.Target,
            IsTypePercent: element.IsTypePercent,
            IsTypeTotal: element.IsTypeTotal,
            IsCurrentStatusType: element.IsCurrentStatusType,
          });
        });
        scoretemp.Criteria = Array.from(CriteriaMap.values());
        res.status(200).json(scoretemp);
      }
    });
  }

  // lấy thùng rác
  getAll_TrashScoretemp(req, res) {
    Scoretemp.getAll_TrashScoretemp((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
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
