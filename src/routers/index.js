import EmployeeRouter from "../routers/Employee";
import HomeRouter from "../routers/Home";
import RoleRouter from "../routers/Role";
import ScoretempRouter from "../routers/Scoretemp";
import CriteriaRouter from "../routers/Criteria";
function route(app) {
  app.use("/api", EmployeeRouter);
  app.use("/api", HomeRouter);
  app.use("/api", RoleRouter);
  app.use("/api", ScoretempRouter);
  app.use("/api", CriteriaRouter);
}
export default route;
