import connection from "../config/db";
const Criteria = {
  getAllCriteria: (callback) => {
    const query = "SELECT * FROM criteria WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
  getOneCriteria: (id, callback) => {
    const query = "SELECT * FROM criteria WHERE IsDeleted = 0 AND _id = ?";
    connection.query(query, id, callback);
  },
  createCriteria: (criteria, callback) => {
    const query =
      "INSERT INTO criteria (ScoreTempId,NameCriteria) VALUES (?,?)";
    const values = [criteria.ScoreTempId, criteria.NameCriteria];
    connection.query(query, values, callback);
  },
  updateCriteria: (id, criteria, callback) => {
    const query = "UPDATE criteria SET ScoreTempId =? ,NameCriteria =? ";
    const values = [criteria.ScoreTempId, criteria.NameCriteria, id];
    connection.query(query, values, callback);
  },

  //detail criteria
  getDetailCriteria_ByCriteriaId: (CriteriaId, callback) => {
    const query =
      "SELECT * FROM criteria_detail WHERE IsDeleted = 0 AND CriteriaId = ?";
    connection.query(query, CriteriaId, callback);
  },
  createDetailCriteria: (detailCriteria, callback) => {
    const query =
      "INSERT INTO criteria_detail (Name,CriteriaId,IsScore,Score) VALUES (?,?,?,?)";
    const values = [
      detailCriteria.Name,
      detailCriteria.CriteriaId,
      detailCriteria.IsScore,
      detailCriteria.Score,
    ];
    connection.query(query, values, callback);
  },
  updateDetailCriteria: (id, detailCriteria, callback) => {
    const query =
      "UPDATE criteria_detail SET Name = ?,CriteriaId = ?,IsScore = ?,Score = ? WHERE _id =?";
    const values = [
      detailCriteria.Name,
      detailCriteria.CriteriaId,
      detailCriteria.IsScore,
      detailCriteria.Score,
      id,
    ];
    connection.query(query, values, callback);
  },
};
export default Criteria;
