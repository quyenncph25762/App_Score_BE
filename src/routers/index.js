import EmployeeRouter from "../routers/Employee";
import HomeRouter from "../routers/Home";
import RoleRouter from "../routers/Role";
import ScoretempRouter from "../routers/Scoretemp";
import CriteriaRouter from "../routers/Criteria";
import ScorefileRouter from "../routers/Scorefile";
function route(app) {
  app.use("/api", EmployeeRouter);
  app.use("/api", HomeRouter);
  app.use("/api", RoleRouter);
  app.use("/api", ScoretempRouter);
  app.use("/api", CriteriaRouter);
  app.use("/api", ScorefileRouter);
}
export default route;
