import connection from "../config/db";
import Employee from "./Employee";
const ScorefileModle = {
  getScorefile_ByEmployee: (EmployeeId, callback) => {
    const query = `SELECT scorefile.*,
    scoretemp.Name AS NameScoretemp
    FROM scorefile
    JOIN scoretemp ON scorefile.ScoreTempId = scoretemp._id
    WHERE scorefile.IsDeleted = 0 AND scorefile.EmployeeId = ?`;
    connection.query(query, EmployeeId, callback);
  },
  getOneScorefile_ByEmployee: (id, EmployeeId, callback) => {
    const query = `
    SELECT scorefile.*,
    d._id AS IdScorefile_Detail,
    d.CriteriaDetailId AS CriteriaDetailId,
    d.TypePercentValue AS TypePercentValue,
    d.TypeTotalValue AS TypeTotalValue,
    d.CurrentStatusValue AS CurrentStatusValue
    FROM scorefile
    LEFT JOIN scorefile_detail d ON scorefile._id = d.ScorefileId
    WHERE scorefile.IsDeleted = 0 AND scorefile._id = ?
    `;
    connection.query(query, [id, EmployeeId], callback);
  },
  createScorefile: (scorefile, callback) => {
    const query = `INSERT INTO scorefile (EmployeeId,ScoreTempId,Code,Score,Status,IsActive) VALUES (?,?,?,?,?,?)`;
    const values = [
      scorefile.EmployeeId,
      scorefile.ScoreTempId,
      scorefile.Code,
      scorefile.Score,
      scorefile.Status,
      scorefile.IsActive,
    ];
    connection.query(query, values, callback);
  },
  updateScorefile: (id, scorefile, callback) => {
    const query = `UPDATE scorefile SET Score  = ?,Status  = ?,IsActive  = ? WHERE _id IN(?)`;
    const values = [scorefile.Score, scorefile.Status, scorefile.IsActive, id];
    connection.query(query, values, callback);
  },
  deleteScorefile: (id, callback) => {
    const query = `UPDATE scorefile SET IsDeleted = 1 WHERE _id IN(?)`;
    connection.query(query, [id], callback);
  },
  restoreScorefile: (id, callback) => {
    const query = `UPDATE scorefile SET IsDeleted = 0 WHERE _id IN(?)`;
    connection.query(query, [id], callback);
  },
  // scoreFile Detail
  creatScoreFile_Detail: (scorefile, callback) => {
    const query =
      "INSERT INTO scorefile_detail (ScorefileId,CriteriaDetailId,EmployeeId,TypePercentValue,TypeTotalValue,CurrentStatusValue) VALUES (?,?,?,?,?,?)";
    const values = [
      scorefile.ScorefileId,
      scorefile.CriteriaDetailId,
      scorefile.EmployeeId,
      scorefile.TypePercentValue,
      scorefile.TypeTotalValue,
      scorefile.CurrentStatusValue,
    ];
    connection.query(query, values, callback);
  },
  deleteScorefile_Detail: (ScorefileId, callback) => {
    const query = "DELETE FROM scorefile_detail WHERE ScorefileId = ?";
    connection.query(query, ScorefileId, callback);
  },
};
export default ScorefileModle;
