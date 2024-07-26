import jwt from "jsonwebtoken";
import Employee from "../models/Employee";
class Checkout {
  checkAdmin(req, res, next) {
    let token = req.cookies.Countryside;
    let par = jwt.verify(token, process.env.SECRET);
    Employee.getOneEmployeeById(par._id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        const data = results[0];
        if (data.RoleId === 1) {
          next();
        } else {
            
          res.redirect("back");
        }
      }
    });
  }
}
export default new Checkout();
