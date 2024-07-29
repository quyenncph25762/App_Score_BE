import { query } from "express";
import connection from "../config/db";
import Employee from "./Employee";
const ScorefileModle = {
  // lấy scorefie chờ xác nhận
  getScorefile_ByEmployee_Inactive: (EmployeeId, callback) => {
    const query = `
    SELECT 
    s._id AS IdScoretemp,
    s.Name AS NameScoretemp,
    s.YearId AS YearId, 
    y.Name AS NameYear,
    sf.IsActive AS IsActive,
    sf._id AS _id,
    sf.Code AS Code
    FROM scorefile sf
    JOIN scoretemp s ON sf.ScoreTempId = s._id
    JOIN year y ON sf.YearId = y._id
    WHERE sf.IsDeleted = 0 AND sf.EmployeeId = ? AND sf.IsActive = 0
    `;
    connection.query(query, [EmployeeId], callback);
  },
  // lấy scorefile đã xác nhận từ employee
  getScorefile_ByEmployee_ActiveNow: (EmployeeId, callback) => {
    const query = `
    SELECT 
    s._id AS IdScoretemp,
    s.Name AS NameScoretemp,
    s.YearId AS YearId, 
    y.Name AS NameYear,
    sf.IsActive AS IsActive,
    sf.Code AS Code,
    sf.Score AS Score,
    sf._id AS _id,
    sf.Status AS Status
    FROM scorefile sf
    JOIN scoretemp s ON sf.ScoreTempId = s._id
    JOIN year y ON sf.YearId = y._id
    WHERE sf.IsDeleted = 0 AND sf.EmployeeId = ? AND sf.IsActive = 1
    `;
    connection.query(query, [EmployeeId], callback);
  },
  // lấy tất cả scorefile
  getScorefile_ByEmployee: (EmployeeId, callback) => {
    const query = `
    SELECT 
    s._id AS IdScoretemp,
    s.Name AS NameScoreTemp,
    s.YearId AS YearId, 
    y.Name AS NameYear,
    sf.IsActive AS IsActive,
    sf.Code AS Code,
    sf.Score AS Score,
    sf.Status AS Status,
    sf._id AS _id
    FROM scorefile sf
    JOIN scoretemp s ON sf.ScoreTempId = s._id
    JOIN year y ON sf.YearId = y._id
    WHERE sf.IsDeleted = 0 AND sf.EmployeeId = ?
    `;
    connection.query(query, [EmployeeId], callback);
  },
  // lấy scorefile theo employee cấp xã
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
    WHERE scorefile.IsDeleted = 0 AND scorefile._id = ? AND scorefile.IsActive = 1
    `;
    connection.query(query, [id, EmployeeId], callback);
  },
  getScoreTempId_IdScorefile: (id, callback) => {
    const query = `SELECT s.*,
    st.Name AS NameScoreTemp
    FROM scorefile s
    JOIN scoretemp st ON s.ScoreTempId = st._id
    WHERE s._id = ?`;
    connection.query(query, id, callback);
  },

  getScorefile_ScoreTempId_EmployeeId_YearId: (
    ScoreTempId,
    EmployeeId,
    YearId,
    callback
  ) => {
    const query = `SELECT * FROM scorefile WHERE ScoreTempId =? AND EmployeeId = ? AND YearId = ?`;
    connection.query(query, [ScoreTempId, EmployeeId, YearId], callback);
  },
  createScorefile: (scorefile, callback) => {
    const query = `INSERT INTO scorefile (EmployeeId,ScoreTempId,YearId,Code) VALUES (?,?,?,?)`;
    const values = [
      scorefile.EmployeeId,
      scorefile.ScoreTempId,
      scorefile.YearId,
      scorefile.Code,
    ];
    connection.query(query, values, callback);
  },
  update_ActiveScorefile: (id, EmployeeId, callback) => {
    const query =
      "UPDATE scorefile SET IsActive = 1 WHERE _id = ? AND EmployeeId = ?";
    connection.query(query, [id, EmployeeId], callback);
  },
  updateScorefile: (id, scorefile, callback) => {
    const query = `UPDATE scorefile SET Score  = ?,Status = ?,IsActive  = ? WHERE _id IN(?)`;
    const values = [scorefile.Score, scorefile.Status, scorefile.IsActive, id];
    connection.query(query, values, callback);
  },
  deleteScorefile: (id, callback) => {
    const query = `UPDATE scorefile SET IsDeleted = 1 WHERE _id IN(?)`;
    connection.query(query, [id], callback);
  },
  deleteScorefile_ScoretempId_EmployeeId_YearId: (
    ScoretempId,
    EmployeeId,
    YearId
  ) => {
    const query =
      "DELETE  FROM scorefile WHERE ScoreTempId NOT IN(?) AND EmployeeId = ? AND YearId = ? AND IsActive = 0 AND IsDeleted = 0";
    connection.query(query, [ScoretempId, EmployeeId, YearId]);
  },
  restoreScorefile: (id, callback) => {
    const query = `UPDATE scorefile SET IsDeleted = 0 WHERE _id IN(?)`;
    connection.query(query, [id], callback);
  },
  // scoreFile Detail

  getScorefileDetail_ByScoreFile_CriteriaDetail_Employee: (
    Scorefile,
    CriteriaDetail,
    Employee,
    callback
  ) => {
    const query = `SELECT * FROM scorefile_detail WHERE ScorefileId = ? AND CriteriaDetailId IN(?) AND EmployeeId = ? AND IsDeleted =0`;
    connection.query(query, [Scorefile, CriteriaDetail, Employee], callback);
  },
  creatScoreFile_Detail: (scorefile, callback) => {
    const query =
      "INSERT INTO scorefile_detail (ScorefileId,CriteriaDetailId,EmployeeId) VALUES (?,?,?)";
    const values = [
      scorefile.ScorefileId,
      scorefile.CriteriaDetailId,
      scorefile.EmployeeId,
    ];
    connection.query(query, values, callback);
  },
  deleteScorefile_Detail: (ScorefileId, callback) => {
    const query = "DELETE FROM scorefile_detail WHERE ScorefileId = ?";
    connection.query(query, ScorefileId, callback);
  },
};
export default ScorefileModle;
