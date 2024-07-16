import connection from "../config/db";

const Employee = {
  // lấy tất cả
  getAllEmployee: (searchName, callback) => {
    const query = `SELECT employee.*,
    city.Name AS NameCity,
    district.Name AS NameAddress,
    ward.Name AS NameWard
    FROM employee
    JOIN city ON employee.cityId = city._id
    JOIN district ON employee.DistrictId = district._id
    JOIN ward ON employee.WardId = ward._id
    WHERE employee.IsDeleted = 0 AND employee.FullName LIKE ?
    `;
    const values = "%" + searchName + "%";
    connection.query(query, [values], callback);
  },
  // lấy theo thành phố
  getEmployeeByCity: (CityId, callback) => {
    const query = `SELECT employee.*,
    city.Name AS NameCity,
    district.Name AS NameAddress,
    ward.Name AS NameWard
    FROM employee
    JOIN city ON employee.cityId = city._id
    JOIN district ON employee.DistrictId = district._id
    JOIN ward ON employee.WardId = ward._id
    WHERE IsDeleted = 0 AND CityId = ?
    `;
    connection.query(query, CityId, callback);
  },
  // lấy theo huyện
  getEmployeeByDistrict: (DistrictId, callback) => {
    const query = `SELECT employee.*,
    city.Name AS NameCity,
    district.Name AS NameAddress,
    ward.Name AS NameWard
    FROM employee
    JOIN city ON employee.cityId = city._id
    JOIN district ON employee.DistrictId = district._id
    JOIN ward ON employee.WardId = ward._id
    WHERE IsDeleted = 0 AND DistrictId = ?
    `;
    connection.query(query, DistrictId, callback);
  },

  // lấy theo xã
  getEmployeeByWard: (WardId, callback) => {
    const query = `SELECT employee.*,
    city.Name AS NameCity,
    district.Name AS NameAddress,
    ward.Name AS NameWard
    FROM employee
    JOIN city ON employee.cityId = city._id
    JOIN district ON employee.DistrictId = district._id
    JOIN ward ON employee.WardId = ward._id
    WHERE IsDeleted = 0 AND WardId = ?
    `;
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
    const query =
      "INSERT INTO employee (Code,RoleId,CityId,DistrictId,WardId,ApartmentId,Address,Avatar,FullName,DoB,Gender,Email,Phone,UserName,Password,CreatorUserId,ObjectId) VALUES (?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?,?)";
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
      Employee.Password,
      Employee.CreatorUserId,
      Employee.ObjectId,
    ];
    connection.query(query, values, callback);
  },
  // update
  updateEmployee: (id, Employee, callback) => {
    const query =
      "UPDATE employee SET RoleId = ?,CityId = ?,DistrictId = ?,WardId = ?,ApartmentId = ?,Address = ?,Avatar = ?,FullName = ?,DoB = ?,Gender = ?,Email = ?,Phone = ?,UserName = ?,Password = ?,CreatorUserId = ?,ObjectId = ? WHERE _id = ?";
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
      Employee.Password,
      Employee.CreatorUserId,
      Employee.ObjectId,
      id,
    ];
    connection.query(query, values, callback);
  },
  // xóa employee
  deleteEmloyee: (id, callback) => {
    const query = "UPDATE employee SET IsDeleted = 1 WHERE _id IN(?)";
    connection.query(query, [id], callback);
  },
  // create info_employee
  createInfo_Employee: (info, callback) => {
    const query = "INSERT INTO info_employee (EmployeeId,FieldId) VALUES (?,?)";
    const values = [info.EmployeeId, info.FieldId];
    connection.query(query, values, callback);
  },
  // xóa info
  deleteInfo_Employee: (id, callback) => {
    const query = "DELETE FROM info_employee WHERE EmployeeId = ? ";
    connection.query(query, id, callback);
  },
  // lấy info_employee theo employeeId
  getAll_InfoEmployee: (EmployeeId, callback) => {
    const query = "SELECT * FROM info_employee WHERE EmployeeId = ?";
    connection.query(query, EmployeeId, callback);
  },
};
export default Employee;
