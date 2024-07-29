import connection from "../config/db";
const Criteria = {
  getOneCriteria: (ScoreTempId, callback) => {
    const query = `SELECT * FROM criteria,Name as NameCriteria
    WHERE IsDeleted = 0 AND  ScoreTempId= ?`;
    connection.query(query, ScoreTempId, callback);
  },
  getAll_ByScoretemp(ScoretempId, callback) {
    const query = `SELECT criteria.*
    scoretemp.Name AS NameScoreTemp
    FROM criteria
    JOIN scoretemp ON criteria.ScoreTempId = scoretemp._id
    WHERE criteria.IsDeleted = 0 AND criteria.ScoretempId = ?`;
    connection.query(query, ScoretempId, callback);
  },
  getCiteria_ByScoreTemId_FieldId(ScoreTempId, FieldId, callback) {
    const query = `SELECT * FROM criteria WHERE ScoreTempId  = ? AND FieldId IN(?) AND IsDeleted = 0`;
    connection.query(query, [ScoreTempId, FieldId], callback);
  },
  createCriteria: (criteria, callback) => {
    const query =
      "INSERT INTO criteria (ScoreTempId,Name,FieldId) VALUES (?,?,?)";
    const values = [criteria.ScoreTempId, criteria.Name, criteria.FieldId];
    connection.query(query, values, callback);
  },
  deleteCriteria: (ScoreTempId, callback) => {
    const query = "DELETE FROM criteria WHERE ScoreTempId = ? ";
    connection.query(query, ScoreTempId, callback);
  },

  //detail criteria
  getDetailCriteria_ScorefileDetail_ByCriteriaId: (
    ScoreFileId,
    CriteriaId,
    EmployeeId,
    callback
  ) => {
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
    connection.query(query, [ScoreFileId, CriteriaId, EmployeeId], callback);
  },
  createDetailCriteria: (detailCriteria, callback) => {
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
    connection.query(query, values, callback);
  },
};
export default Criteria;
