import jwt from "jsonwebtoken";
import Employee from "../models/Employee";
class Checkout {
  checkAdmin(req, res, next) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    console.log(par);
    next();
  }
}
export default new Checkout();
