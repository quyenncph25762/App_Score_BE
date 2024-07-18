import EmployeeRouter from "../routers/Employee";
import HomeRouter from "../routers/Home";
import RoleRouter from "../routers/Role";
import ScoretempRouter from "../routers/Scoretemp";
function route(app) {
  app.use("/api", EmployeeRouter);
  app.use("/api", HomeRouter);
  app.use("/api", RoleRouter);
  app.use("/api", ScoretempRouter);
}
export default route;
