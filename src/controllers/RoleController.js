import RoleModle from "../models/Role";
class RoleController {
  getAllRoles(req, res) {
    RoleModle.getAllRoles((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  getAllTrashRoles(req, res) {
    RoleModle.getTrashRole((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  getOneRole(req, res) {
    const id = req.params.id;
    RoleModle.getOneRole(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        const result = results[0];
        res.status(200).json(result);
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
  //restore one
  restoreRole(req, res) {
    const id = req.params.id;
    RoleModle.restoreRole(id, (err, results) => {
      if (err) {
        console.log("Erorr", err);
      } else {
        res.status(200).json({
          messager: "Khôi phục thành công",
        });
      }
    });
  }
  //restore all selected
  restoreAllSelectedRoles(req, res) {
    const id = req.body;
    RoleModle.restoreRole(id, (err, results) => {
      if (err) {
        console.log("Erorr", err);
      } else {
        res.status(200).json({
          messager: "Khôi phục thành công",
        });
      }
    });
  }
  //delete one
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
  //delete all selected
  deleteAllSelectedRoles(req, res) {
    // 1 mảng id
    const id = req.body;
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
