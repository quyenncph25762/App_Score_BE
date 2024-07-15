import connection from "../config/db";

const Employee = {
  // get account
  getAllEmployee: (callback) => {
    const query = "SELECT * FROM employee WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
  getEmployeeByCity: (CityId, callback) => {
    const query = "SELECT * FROM employee WHERE IsDeleted = 0 AND CityId = ?";
    connection.query(query, CityId, callback);
  },
  getEmployeeByDistrict: (DistrictId, callback) => {
    const query =
      "SELECT * FROM employee WHERE IsDeleted = 0 AND DistrictId = ?";
    connection.query(query, DistrictId, callback);
  },
  getEmployeeByWard: (WardId, callback) => {
    const query = "SELECT * FROM employee WHERE IsDeleted = 0 AND WardId = ?";
    connection.query(query, WardId, callback);
  },
  // kiểm tra tài khoản tồn tại
  getEmployeeBy_EmailAndUserName: (Email, UserName, callback) => {
    const query =
      "SELECT * FROM employee WHERE IsDeleted = 0 AND Email = ? AND UserName = ?";
    connection.query(query, [Email, UserName], callback);
  },
  //
  getEmployeeBy_IdAndPassword: (id, PassWord, callback) => {
    const query =
      "SELECT * FROM employee WHERE IsDeleted = 0 AND _id = ? AND PassWord = ?";
    connection.query(query, [id, PassWord], callback);
  },
  // login
  getOneEmloyee: (UserName, PassWord, DistrictId, callback) => {
    const query =
      "SELECT * FROM employee WHERE IsDeleted = 0 AND UserName = ? AND PassWord = ? AND DistrictId = ?";
    connection.query(query, [UserName, PassWord, DistrictId], callback);
  },
  // change password
  changeEmployee: (id, Employee, callback) => {
    const query = "UPDATE employee SET PassWord = ? WHERE id = ?";
    const values = [Employee.PassWord, id];
    connection.query(query, values, callback);
  },
  // create
  createEmployee: (Employee, callback) => {
    const query =
      "INSERT INTO employee (Code,RoleId,CityId,DistrictId,WardId,ApartmentId,Address,Avatar,FullName,DoB,Gender,Email,Phone,UserName,PassWord,CreatorUserId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
    const values = [
      Employee.Code,
      Employee.RoleId,
      Employee.CityId,
      Employee.DistrictId,
      Employee.WardId,
      Employee.ApartmentId,
      Employee.Address,
      Employee.Avatar,
      Employee.FullName,
      Employee.DoB,
      Employee.Gender,
      Employee.Email,
      Employee.Phone,
      Employee.UserName,
      Employee.PassWord,
      Employee.CreatorUserId,
    ];
    connection.query(query, values, callback);
  },
  updateEmployee: (id, Employee, callback) => {
    const query =
      "UPDATE employee SET RoleId = ?,CityId = ?,DistrictId = ?,WardId = ?,ApartmentId = ?,Address = ?,Avatar = ?,FullName = ?,DoB = ?,Gender = ?,Email = ?,Phone = ?,UserName = ?,PassWord = ?,CreatorUserId = ? WHERE _id = ?";
    const values = [
      Employee.RoleId,
      Employee.CityId,
      Employee.DistrictId,
      Employee.WardId,
      Employee.ApartmentId,
      Employee.Address,
      Employee.Avatar,
      Employee.FullName,
      Employee.DoB,
      Employee.Gender,
      Employee.Email,
      Employee.Phone,
      Employee.UserName,
      Employee.PassWord,
      Employee.CreatorUserId,
      id,
    ];
    connection.query(query, values, callback);
  },
  deleteEmloyee: (id, callback) => {
    const query = "UPDATE employee SET IsDeleted = 1";
    connection.query(query, id, callback);
  },
};
export default Employee;
