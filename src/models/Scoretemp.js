import connection from "../config/db";
const Scoretemp = {
  getAllScoretemp: (callback) => {
    const query = `SELECT scoretemp.*,
    year.Name AS NameYear,
    object.NameObject AS NameObject
    FROM scoretemp
    JOIN year ON scoretemp.YearId = year._id
    JOIN object ON scoretemp.ObjectId = object._id
    WHERE scoretemp.IsDeleted = 0`;
    connection.query(query, callback);
  },
  getOneScoretemp: (id, callback) => {
    const query = `SELECT s.*,
    s.Name AS NameScoretemp,
    y.Name AS NameYear,
    o.NameObject AS NameObject,
    c.Name AS NameCriteria,c._id AS Criteria_id,c.FieldId AS FieldId,
    d.Name AS NameCriteriaDetail,d.Score AS Score,d.Target AS Target,d.IsTypePercent AS IsTypePercent,d.IsTypeTotal AS IsTypeTotal,d.IsCurrentStatusType AS IsCurrentStatusType
    FROM scoretemp s
    JOIN year y ON s.YearId = y._id
    JOIN object o ON s.ObjectId = o._id
    LEFT JOIN criteria c ON s._id = c.ScoretempId
    LEFT JOIN criteria_detail d ON c._id = d.CriteriaId
    WHERE s.IsDeleted = 0 AND s._id = ?`;
    connection.query(query, id, callback);
  },
  getAll_TrashScoretemp: (callback) => {
    const query = `SELECT scoretemp.*,
    year.Name AS NameYear,
    object.NameObject AS NameObject
    FROM scoretemp
    JOIN year ON scoretemp.YearId = year._id
    JOIN object ON scoretemp.ObjectId = object._id
    WHERE scoretemp.IsDeleted = 1`;
    connection.query(query, callback);
  },
  createScoretemp: (temp, callback) => {
    const query =
      "INSERT INTO scoretemp (Code,Name,YearId,ObjectId,IsActive,Description) VALUES (?,?,?,?,?,?)";
    const values = [
      temp.Code,
      temp.Name,
      temp.YearId,
      temp.ObjectId,
      temp.IsActive,
      temp.Description,
    ];
    connection.query(query, values, callback);
  },
  updateScoretemp: (id, temp, callback) => {
    const query =
      "UPDATE scoretemp SET Code = ?,Name = ?,YearId = ?,ObjectId = ?,IsActive = ?,Description = ? WHERE _id = ?";
    const values = [
      temp.Code,
      temp.Name,
      temp.YearId,
      temp.ObjectId,
      temp.IsActive,
      temp.Description,
      id,
    ];
    connection.query(query, values, callback);
  },
  deleteScoretemp: (id, callback) => {
    const query = "UPDATE scoretemp SET IsDeleted = 1 WHERE _id IN(?)";
    connection.query(query, [id], callback);
  },
  restoreScoretemp: (id, callback) => {
    const query = "UPDATE scoretemp SET IsDeleted = 0 WHERE _id IN(?)";
    connection.query(query, [id], callback);
  },
};
export default Scoretemp;
