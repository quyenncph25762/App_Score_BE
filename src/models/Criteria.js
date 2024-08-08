import connection from "../config/db";
const Criteria = {
  getOneCriteria: (ScoreTempId, callback) => {
    const query = `SELECT * FROM criteria,Name as NameCriteria
    WHERE IsDeleted = 0 AND  ScoreTempId= ?`;
    connection.query(query, ScoreTempId, callback);
  },
  getAll_ByScoretemp(ScoretempId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT criteria.*,
      scoretemp.Name AS NameScoreTemp
      FROM criteria
      JOIN scoretemp ON criteria.ScoreTempId = scoretemp._id
      WHERE criteria.IsDeleted = 0 AND criteria.ScoretempId = ?`;
      connection.query(query, ScoretempId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  getCiteria_ByScoreTemId_FieldId(ScoreTempId, FieldId) {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM criteria WHERE ScoreTempId  = ? AND FieldId IN(?) AND IsDeleted = 0`;
      connection.query(query, [ScoreTempId, FieldId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  createCriteria: (criteria) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO criteria (ScoreTempId,Name,FieldId) VALUES (?,?,?)";
      const values = [criteria.ScoreTempId, criteria.Name, criteria.FieldId];
      connection.query(query, values, (err, data) => {
        if (err) {
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  },
  updateCriteria: (id, criteria) => {
    return new Promise((resolve, reject) => {
      const query = ` UPDATE criteria SET ScoreTempId = ?,Name = ?,FieldId = ? WHERE _id = ?`;
      const values = [
        criteria.ScoreTempId,
        criteria.Name,
        criteria.FieldId,
        id,
      ];
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  deleteCriteria: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM criteria WHERE _id = ? ";
      connection.query(query, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  //detail criteria --> để chấm điểm 
  getDetailCriteria_ScorefileDetail_ByCriteriaId: (
    ScoreFileId,
    CriteriaId,
    EmployeeId
  ) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT cd.*,
      c.Name AS NameCriteria,
      c._id AS IdCriteria,
      sd._id AS IdScoreFile_Detail,
      sd.TypePercentValue AS TypePercentValue,
      sd.TypeTotalValue AS TypeTotalValue,
      sd.CurrentStatusValue AS CurrentStatusValue
      FROM criteria_detail cd
       JOIN criteria c ON cd.CriteriaId = c._id
       JOIN scorefile_detail sd ON cd._id = sd.CriteriaDetailId
      WHERE cd.IsDeleted = 0 AND sd.ScorefileId = ? AND cd.CriteriaId IN(?) AND sd.EmployeeId = ?`;
      connection.query(
        query,
        [ScoreFileId, CriteriaId, EmployeeId],
        (err, results) => {
          if (err) {
            reject(err);
          } else {
            resolve(results);
          }
        }
      );
    });
  },
  getOneCriteriaDetail: (id, callback) => {
    const query = `SELECT * FROM criteria_detail WHERE _id = ?`;
    connection.query(query, id, callback);
  },
  getCriteriaDetail_ByCriteriaId: (id) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM criteria_detail WHERE CriteriaId = ?";
      connection.query(query, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  createDetailCriteria: (detailCriteria) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO criteria_detail (Name,CriteriaId,Score,Target,IsTypePercent,IsTypeTotal,IsCurrentStatusType) VALUES (?,?,?,?,?,?,?)";
      const values = [
        detailCriteria.Name,
        detailCriteria.CriteriaId,
        detailCriteria.Score,
        detailCriteria.Target,
        detailCriteria.IsTypePercent,
        detailCriteria.IsTypeTotal,
        detailCriteria.IsCurrentStatusType,
      ];
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  updateCriteriaDetail: (id, detailCriteria) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE criteria_detail SET Name = ?,CriteriaId = ?,Score = ?,Target = ?,IsTypePercent = ?,IsTypeTotal = ?,IsCurrentStatusType = ? WHERE _id = ?`;
      const values = [
        detailCriteria.Name,
        detailCriteria.CriteriaId,
        detailCriteria.Score,
        detailCriteria.Target,
        detailCriteria.IsTypePercent,
        detailCriteria.IsTypeTotal,
        detailCriteria.IsCurrentStatusType,
        id,
      ];
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  deleteCriteriaDetail: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM criteria_detail WHERE _id = ? ";
      connection.query(query, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
};
export default Criteria;
