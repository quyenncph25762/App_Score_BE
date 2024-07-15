import { create } from "express-handlebars";
import connection from "../config/db";
const RoleModle = {
  //role
  getAllRoles: (callback) => {
    const query = "SELECT * FROM role WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
  creatRole: (role, callback) => {
    const query = "INSERT INTO role (NameRole,Note) VALUES(?,?)";
    const values = [role.NameRole, role.Note];
    connection.query(query, values, callback);
  },
  updateRole: (id, role, callback) => {
    const query = "UPDATE role SET NameRole =?,Note = ? WHERE _id = ?";
    const values = [role.NameRole, role.Note, id];
    connection.query(query, values, callback);
  },
  deleteRole: (id, callback) => {
    const query = "UPDATE role SET IsDeleted = 1 WHERE _id = ?";
    connection.query(query, id, callback);
  },
  /// permission_role
  getAllPermission: (callback) => {
    const query = "SELECT * FROM permission WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
  createPermission: (permission, callback) => {
    const query = "INSERT INTO permission (RoleId,Name) VALUSE(?,?)";
    const values = [permission.RoleId, permission.Name];
    connection.query(query, values, callback);
  },
  deletePermission: (RoleId, callback) => {
    const query = "DELETE FROM permission WHERE RoleId = ?";
    connection.query(query, RoleId, callback);
  },
};
export default RoleModle;
