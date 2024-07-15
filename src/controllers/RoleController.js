import RoleModle from "../models/Role";
class RoleController {
  getAllRoles(req, res) {
    RoleModle.getAllRoles((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json({
          messager: "Get data success",
          data: results,
        });
      }
    });
  }
  createRole(req, res) {
    const { NameRole, Note } = req.body;

    RoleModle.creatRole({ NameRole, Note }, (err, result) => {
      if (err) {
        console.log("Error", err);
      } else {
        const RoleId = result.insertId;

        // RoleModle.createPermission(
        //   {
        //     RoleId: RoleId,
        //     Name:
        //   },
        //   (err, data)
        // );
        res.status(200).json({
          messager: "Thêm Role thành công",
        });
      }
    });
  }
  updateRole(req, res) {
    const id = req.params.id;
    RoleModle.updateRole(id, req.body, (err, results) => {
      if (err) {
        console.log("Erorr", err);
      } else {
        res.status(200).json({
          messager: "Chỉnh sửa Role thành công",
        });
      }
    });
  }
  deleteRole(req, res) {
    const id = req.params.id;
    RoleModle.deleteRole(id, (err, results) => {
      if (err) {
        console.log("Erorr", err);
      } else {
        res.status(200).json({
          messager: "Xóa Role thành công",
        });
      }
    });
  }
}
export default new RoleController();
