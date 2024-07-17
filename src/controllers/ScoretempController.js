import Scoretemp from "../models/Scoretemp";
class ScoretempController {
  getAllScoretemp(req, res) {
    Scoretemp.getAllScoretemp((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  // 
  getOneScoretemp(req,res){
    
  }
}
export default new ScoretempController();
