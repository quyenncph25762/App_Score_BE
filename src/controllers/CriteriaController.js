import Criteria from "../models/Criteria";
class CriteriaController {
  // lấy tất cả theo scoretemp
  async getByScoretemp_Criteria(req, res) {
    const scoretempId = req.params.id;
    const data = await Criteria.getAll_ByScoretemp(scoretempId);
    res.status(200).json(data);
  }
  getOneCriteria(req, res) {
    const id = req.params.id;
    Criteria.getOneCriteria(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        const data = results[0];
        res.status(200).json(data);
      }
    });
  }
  getDetailCriteria_ByCriteriaId(req, res) {
    const id = req.params.id;
    Criteria.getDetailCriteria_ByCriteriaId(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        const data = results[0];
        res.status(200).json(data);
      }
    });
  }
}
export default new CriteriaController();
