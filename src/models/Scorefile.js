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
 
  
};
export default ScorefileModle;
