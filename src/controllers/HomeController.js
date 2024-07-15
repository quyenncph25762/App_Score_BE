import HomeModle from "../models/Home";
class EmployeeController {
  getAllCities(req, res) {
    HomeModle.getAllCities((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  getAllDistricts(req, res) {
    const CityId = req.params.id;
    HomeModle.getAllDistricts(CityId, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  getAllWards(req, res) {
    const WardId = req.params.id;
    HomeModle.getAllWards(WardId, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  getAllObjects(req, res) {
    HomeModle.getAllObjects((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  getAllFields(req, res) {
    HomeModle.getAllFields((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
  getAllApartment(req, res) {
    HomeModle.getAllApartment((err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json(results);
      }
    });
  }
}
export default new EmployeeController();
