import connection from "../config/db";
const Scoretemp = {
  getAllScoretemp: (callback) => {
    const query = "SELECT * FROM scoretemp WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
  getOneScoretemp: (id, callback) => {
    const query = "SELECT * FROM scoretemp WHERE IsDeleted = 0 AND _id =?";
    connection.query(query, id, callback);
  },
  createScoretemp: (temp, callback) => {
    const query = "INSERT INTO scoretemp (Code,Name,Note) VALUES (?,?,?)";
    const values = [temp.Code, temp.Name, temp.Note];
    connection.query(query, values, callback);
  },
  updateScoretemp: (id, temp, callback) => {
    const query =
      "UPDATE scoretemp SET Code = ?,Name = ?,Note = ? WHERE _id = ?";
    const values = [temp.Code, temp.Name, temp.Note, id];
    connection.query(query, values, callback);
  },
};
export default Scoretemp;
