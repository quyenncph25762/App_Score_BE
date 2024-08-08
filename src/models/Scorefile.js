import connection from "../config/db";
const ScorefileModle = {
  // lấy tất cả scorefile
  getScorefile_ByEmployee: (EmployeeId, RoleId, callback) => {
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
    sf._id AS _id,
    sf.IsSend AS IsSend,
    city.Name AS NameCity,
    district.Name AS NameDistrict,
    ward.Name AS NameWard
    FROM scorefile sf
    JOIN employee ON sf.CreatorId = employee._id
    JOIN city ON employee.CityId = city._id
    LEFT JOIN district ON employee.DistrictId = district._id
    LEFT JOIN ward ON employee.WardId = ward._id
    JOIN scoretemp s ON sf.ScoreTempId = s._id
    JOIN year y ON sf.YearId = y._id
    WHERE sf.IsDeleted = 0 AND sf.EmployeeId = ?  AND (${RoleId} = 1 OR sf.IsActive = 1)
    `;

    connection.query(query, [EmployeeId], callback);
  },
  // lấy scoregile đã duyệt và chấm xong
  getOneScorefile_ById_byActiveAndStatus: (id) => {
    return new Promise((resolve, reject) => {
      const query = `
    SELECT *
    FROM scorefile
    WHERE IsDeleted = 0 AND _id = ? AND IsActive = 1 AND Status = 1 
    `;
      connection.query(query, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  //lấy scorefile theo id
  getScorefile_ById: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT s.*,
      sd._id AS ScorefileDetailId,
      sd.TypePercentValue = TypePercentValue,
      sd.TypeTotalValue = TypeTotalValue,
      sd.CurrentStatusValue = CurrentStatusValue
      FROM scorefile s 
      JOIN scorefile_detail sd ON s._id = sd.ScorefileId
      WHERE s._id = ? AND s.IsDeleted = 0`;
      connection.query(query, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  getScoreTempId_IdScorefile: (id) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT s.*,
    st.Name AS NameScoreTemp
    FROM scorefile s
    JOIN scoretemp st ON s.ScoreTempId = st._id
    WHERE s._id = ?`;
      connection.query(query, id, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  getScorefile_ScoreTempId_EmployeeId_YearId: (
    ScoreTempId,
    EmployeeId,
    YearId
  ) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM scorefile WHERE ScoreTempId =? AND EmployeeId = ? AND YearId = ?`;
      connection.query(
        query,
        [ScoreTempId, EmployeeId, YearId],
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
  // lấy những scorefile gửi cho tỉnh để duyệt
  getOne_Scorefile_forCity: (EmployeeId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM scorefile WHERE EmployeeId = ?`;
      connection.query(query, EmployeeId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // kiểm tra xem xã đã gửi phiếu chưa
  getOne_Scorefile_ScorefileId: (scoreFileId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM scorefile WHERE IsDeleted = 0 AND ScorefileId_Sent = ?`;
      connection.query(query, scoreFileId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  createScorefile: (scorefile) => {
    return new Promise((resolve, reject) => {
      const query = `INSERT INTO scorefile (EmployeeId,ScoreTempId,CreatorId,ScorefileId_Sent,YearId,Code) VALUES (?,?,?,?,?,?)`;
      const values = [
        scorefile.EmployeeId,
        scorefile.ScoreTempId,
        scorefile.CreatorId,
        scorefile.ScorefileId_Sent,
        scorefile.YearId,
        scorefile.Code,
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
  update_ActiveScorefile: (id, EmployeeId) => {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE scorefile SET IsActive = 1 WHERE _id = ? AND EmployeeId = ?";
      connection.query(query, [id, EmployeeId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // đổi trạng thái đã duyệt cho scorefile
  update_IsSend_Scorefile_confirmed: (ScorefileId) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE scorefile SET IsSend = 2 WHERE _id = ?";
      connection.query(query, ScorefileId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // đổi trạng thái đã duyệt cho scorefile
  update_IsSend_Scorefile_sent: (ScorefileId) => {
    return new Promise((resolve, reject) => {
      const query = "UPDATE scorefile SET IsSend = 1 WHERE _id = ?";
      connection.query(query, ScorefileId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  updateScorefile: (id, scorefile) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE scorefile SET Status = ? WHERE _id = ?`;
      const values = [scorefile.Status, id];
      connection.query(query, values, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
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
    return new Promise((resolve, reject) => {
      const query =
        "DELETE  FROM scorefile WHERE ScoreTempId NOT IN(?) AND EmployeeId = ? AND YearId = ? AND IsActive = 0 AND IsDeleted = 0";
      connection.query(
        query,
        [ScoretempId, EmployeeId, YearId],
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
  creatScoreFile_Detail: (scorefile) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO scorefile_detail (ScorefileId,CriteriaDetailId,EmployeeId) VALUES (?,?,?)";
      const values = [
        scorefile.ScorefileId,
        scorefile.CriteriaDetailId,
        scorefile.EmployeeId,
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
  updateScorefile_Detail: (id, scorefile_detail) => {
    return new Promise((resolve, reject) => {
      const query = `UPDATE scorefile_detail SET TypePercentValue =?, TypeTotalValue =?,CurrentStatusValue = ? WHERE _id = ?`;
      const values = [
        scorefile_detail.TypePercentValue,
        scorefile_detail.TypeTotalValue,
        scorefile_detail.CurrentStatusValue,
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
  deleteScorefile_Detail: (ScorefileId, callback) => {
    const query = "DELETE FROM scorefile_detail WHERE ScorefileId_Sent = ?";
    connection.query(query, ScorefileId, callback);
  },
};
export default ScorefileModle;
