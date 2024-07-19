import connection from "../config/db";
const Criteria = {
  getOneCriteria: (id, callback) => {
    const query = `SELECT criteria.*
    scoretemp.Name AS NameScoreTemp
    FROM criteria
    JOIN scoretemp ON criteria.ScoreTempId = scoretemp._id
    WHERE criteria.IsDeleted = 0 AND criteria._id = ?`;
    connection.query(query, id, callback);
  },
  getAll_ByScoretemp(ScoretempId, callback) {
    const query = `SELECT criteria.*
    scoretemp.Name AS NameScoreTemp
    FROM criteria
    JOIN scoretemp ON criteria.ScoreTempId = scoretemp._id
    WHERE criteria.IsDeleted = 0 AND criteria.ScoretempId = ?`;
    connection.query(query, ScoretempId, callback);
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
  getDetailCriteria_ByCriteriaId: (CriteriaId, callback) => {
    const query = `SELECT criteria_detail.*
      criteria.NameCriteria as NameCriteria
      FROM criteria_detail
      JOIN criteria ON criteria_detail.Criteria = criteria._id
      WHERE criteria_detail.IsDeleted = 0 AND criteria_detail.CriteriaId = ?`;
    connection.query(query, CriteriaId, callback);
  },
  createDetailCriteria: (detailCriteria, callback) => {
    const query =
      "INSERT INTO criteria_detail (Name,CriteriaId,Score,Target,IsTypePercent,IsTypeTotal,IsCurrentStatusType,TypePercentValue,TypeTotalValue,CurrentStatusValue) VALUES (?,?,?,?,?,?,?,?,?,?)";
    const values = [
      detailCriteria.Name,
      detailCriteria.CriteriaId,
      detailCriteria.Score,
      detailCriteria.Target,
      detailCriteria.IsTypePercent,
      detailCriteria.IsTypeTotal,
      detailCriteria.IsCurrentStatusType,
      detailCriteria.TypePercentValue,
      detailCriteria.TypeTotalValue,
      detailCriteria.CurrentStatusValue,
    ];
    connection.query(query, values, callback);
  },
};
export default Criteria;
