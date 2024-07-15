import EmployeeRouter from "../routers/Employee";
import HomeRouter from "../routers/Home";
import RoleRouter from "../routers/Role";
function route(app) {
  app.use("/api", EmployeeRouter);
  app.use("/api", HomeRouter);
  app.use("/api", RoleRouter);
  
}
export default route;
