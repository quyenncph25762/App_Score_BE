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
};
export default ScorefileModle;
