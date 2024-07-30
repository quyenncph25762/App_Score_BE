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
            const data = await CriteriaModle.createCriteria(form);
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
                await CriteriaModle.createDetailCriteria(formDetail);
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

  async updateScoretemp(req, res) {
    const id = req.params.id;
    const Criteria = req.body.Criteria;
    try {
      await Scoretemp.updateScoretemp(id, req.body);

      // Remove criteria not present in the client data
      const currentCriteria = await CriteriaModle.getAll_ByScoretemp(id);
      const currentCriteriaIds = new Set(
        currentCriteria.map((item) => item._id)
      );
      const clientCriteriaIds = new Set(Criteria.map((item) => item._id));

      for (const criteriaId of currentCriteriaIds) {
        if (!clientCriteriaIds.has(criteriaId)) {
          await CriteriaModle.deleteCriteria(criteriaId);
        }
      }

      // Process the criteria from the client
      for (const criteria of Criteria) {
        const form = {
          ScoreTempId: id,
          Name: criteria.Name,
          FieldId: criteria.FieldId,
        };

        if (criteria._id) {
          await CriteriaModle.updateCriteria(criteria._id, form);

          // Handle criteria details
          const currentCriteriaDetail =
            await CriteriaModle.getCriteriaDetail_ByCriteriaId(criteria._id);
          const currentCriteriaDetailIds = new Set(
            currentCriteriaDetail.map((item) => item._id)
          );
          const clientCriteriaDetailIds = new Set(
            criteria.listCriteria.map((item) => item._id)
          );

          // Remove details not present in the client data
          for (const detailId of currentCriteriaDetailIds) {
            if (!clientCriteriaDetailIds.has(detailId)) {
              await CriteriaModle.deleteCriteriaDetail(detailId);
            }
          }

          // Update or create details
          for (const detail of criteria.listCriteria || []) {
            const formDetail = {
              Name: detail.Name,
              CriteriaId: criteria._id,
              Score: detail.Score,
              Target: detail.Target,
              IsTypePercent: detail.IsTypePercent,
              IsTypeTotal: detail.IsTypeTotal,
              IsCurrentStatusType: detail.IsCurrentStatusType,
            };

            if (detail._id) {
              await CriteriaModle.updateCriteriaDetail(detail._id, formDetail);
            } else {
              await CriteriaModle.createDetailCriteria(formDetail);
            }
          }
        } else {
          // Create new criteria
          const { insertId: CriteriaId } = await CriteriaModle.createCriteria(
            form
          );
          console.log(criteria.listCriteria);
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
              await CriteriaModle.createDetailCriteria(formDetail);
            }
          }
        }
      }

      res.status(200).json({ message: "Cập nhật phiếu thành công" });
    } catch (error) {
      console.log("Error", error);
      res.status(500).json({ message: "Internal server error" });
    }
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
