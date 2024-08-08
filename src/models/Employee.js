import connection from "../config/db";

const Employee = {
  // lấy tất cả
  getAllEmployee: (searchName) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT employee.*,
      city.Name AS NameCity,
      district.Name AS NameDistrict,
      ward.Name AS NameWard,
      role.NameRole AS RoleName
      FROM employee
      JOIN city ON employee.cityId = city._id
      LEFT JOIN district ON employee.DistrictId = district._id
      LEFT JOIN ward ON employee.WardId = ward._id
      JOIN role ON employee.RoleId = role._id
      WHERE employee.IsDeleted = 0 AND employee.FullName LIKE ? AND NOT (employee.RoleId = 1 AND employee.CityId IS NULL)
      `;
      const values = "%" + searchName + "%";
      connection.query(query, [values], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // lấy admin huyện theo xã
  getOne_Admin_District_Or_Ward: (CityId, DistrictId, ApartmentId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM employee WHERE RoleId = 1 AND CityId = ? AND DistrictId = ? AND ApartmentId = ?`;
      connection.query(
        query,
        [CityId, DistrictId, ApartmentId],
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
  // lấy admin tỉnh theo huyện
  getOne_Admin_City: (CityId, ApartmentId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT * FROM employee WHERE RoleId = 1 AND CityId = ? AND ApartmentId = ?`;
      connection.query(query, [CityId, ApartmentId], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // kiểm tra tài khoản tồn tại
  getEmployeeBy_EmailAndUserName: (Email, UserName) => {
    return new Promise((resolve, reject) => {
      const query =
        "SELECT * FROM employee WHERE IsDeleted = 0 AND Email = ? OR UserName = ?";
      connection.query(query, [Email, UserName], (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // lấy những taikhoan xã và tài khoản con của huyện theo admin huyện
  getWardAndDistrict_By_AdminDistrict: (DistrictId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT employee.*,
    city.Name AS NameCity,
    district.Name AS NameDistrict,
    ward.Name AS NameWard,
    role.NameRole AS RoleName
    FROM employee
    JOIN city ON employee.cityId = city._id
    LEFT JOIN district ON employee.DistrictId = district._id
    LEFT JOIN ward ON employee.WardId = ward._id
    JOIN role ON employee.RoleId = role._id
    WHERE employee.IsDeleted = 0 AND employee.DistrictId = ? AND NOT (employee.RoleId = 1 AND employee.ApartmentId = 2)
     `;
      connection.query(query, DistrictId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // lấy những tài khoản con của tỉnh theo admin tình
  getCityBy_AdminCity: (CityId) => {
    return new Promise((resolve, reject) => {
      const query = `SELECT employee.*,
    city.Name AS NameCity,
    district.Name AS NameDistrict,
    ward.Name AS NameWard,
    role.NameRole AS RoleName
    FROM employee
    JOIN city ON employee.cityId = city._id
    LEFT JOIN district ON employee.DistrictId = district._id
    LEFT JOIN ward ON employee.WardId = ward._id
    JOIN role ON employee.RoleId = role._id
    WHERE employee.IsDeleted = 0 AND employee.CityId = ? AND NOT (employee.RoleId = 1 AND employee.ApartmentId = 1)`;
      connection.query(query, CityId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // thùng rác
  trashEmployee: () => {
    return new Promise((resolve, reject) => {
      const query = `SELECT employee.*,
      city.Name AS NameCity,
      district.Name AS NameDistrict,
      ward.Name AS NameWard,
      role.NameRole AS RoleName
      FROM employee
      JOIN city ON employee.cityId = city._id
      JOIN district ON employee.DistrictId = district._id
      JOIN ward ON employee.WardId = ward._id
      JOIN role ON employee.RoleId = role._id
      WHERE employee.IsDeleted = 1`;
      connection.query(query, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
  // lấy theo id
  getOneEmployeeById: (id) => {
    return new Promise((resolve, reject) => {
      const query = `
    SELECT employee.*,
    city.Name AS NameCity,
    district.Name AS NameDistrict,
    ward.Name AS NameWard,
    role.NameRole AS RoleName
    FROM employee
    LEFT JOIN city ON employee.cityId = city._id
    LEFT JOIN district ON employee.DistrictId = district._id
    LEFT JOIN ward ON employee.WardId = ward._id
    JOIN role ON employee.RoleId = role._id
    WHERE employee.IsDeleted = 0 AND employee._id = ?
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
  //
  getEmployeeBy_IdAndPassword: (id, PassWord, callback) => {
    const query =
      "SELECT * FROM employee WHERE IsDeleted = 0 AND _id = ? AND Password = ?";
    connection.query(query, [id, PassWord], callback);
  },
  // login
  getOneEmloyee: (UserName, PassWord, callback) => {
    const query =
      "SELECT * FROM employee WHERE IsDeleted = 0 AND UserName = ? AND Password = ?";
    connection.query(query, [UserName, PassWord], callback);
  },
  // change password
  changeEmployee: (id, Employee, callback) => {
    const query = "UPDATE employee SET Password = ? WHERE id = ?";
    const values = [Employee.PassWord, id];
    connection.query(query, values, callback);
  },
  // create
  createEmployee: (Employee, callback) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO employee (Code,RoleId,CityId,DistrictId,WardId,ApartmentId,Customer,Avatar,FullName,Email,Phone,UserName,Password,CreatorUserId,IsActive) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
      const values = [
        Employee.Code,
        Employee.RoleId,
        Employee.CityId,
        Employee.DistrictId,
        Employee.WardId,
        Employee.ApartmentId,
        Employee.Customer,
        Employee.Avatar,
        Employee.FullName,
        Employee.Email,
        Employee.Phone,
        Employee.UserName,
        Employee.Password,
        Employee.CreatorUserId,
        Employee.IsActive,
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
  // update
  updateEmployee: (id, Employee) => {
    return new Promise((resolve, reject) => {
      const query =
        "UPDATE employee SET RoleId = ?,CityId = ?,DistrictId = ?,WardId = ?,ApartmentId = ?,Customer = ?,Avatar = ?,FullName = ?,Email = ?,Phone = ?,UserName = ?,CreatorUserId = ?,IsActive = ? WHERE _id = ?";
      const values = [
        Employee.RoleId,
        Employee.CityId,
        Employee.DistrictId,
        Employee.WardId,
        Employee.ApartmentId,
        Employee.Customer,
        Employee.Avatar,
        Employee.FullName,
        Employee.Email,
        Employee.Phone,
        Employee.UserName,
        Employee.CreatorUserId,
        Employee.IsActive,
        id,
      ];
      connection.query(query, values, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  // xóa employee
  deleteEmloyee: (id, callback) => {
    const query = "UPDATE employee SET IsDeleted = 1 WHERE _id IN(?)";
    connection.query(query, [id], callback);
  },
  // restore
  restoreEmloyee: (id, callback) => {
    const query = "UPDATE employee SET IsDeleted = 0 WHERE _id IN(?)";
    connection.query(query, [id], callback);
  },

  // create field_employee
  createField_Employee: (field) => {
    return new Promise((resolve, reject) => {
      const query =
        "INSERT INTO field_employee (EmployeeId,FieldId) VALUES (?,?)";
      const values = [field.EmployeeId, field.FieldId];
      connection.query(query, values, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  // xóa field
  deleteField_Employee: (id) => {
    return new Promise((resolve, reject) => {
      const query = "DELETE FROM field_employee WHERE EmployeeId = ? ";
      connection.query(query, id, (err, results) => {
        if (err) {
          return reject(err);
        }
        return resolve(results);
      });
    });
  },
  // lấy field_employee theo employeeId
  getAll_FieldEmployee: (EmployeeId) => {
    return new Promise((resolve, reject) => {
      const query = "SELECT * FROM field_employee WHERE EmployeeId = ?";
      connection.query(query, EmployeeId, (err, results) => {
        if (err) {
          reject(err);
        } else {
          resolve(results);
        }
      });
    });
  },
};
export default Employee;
