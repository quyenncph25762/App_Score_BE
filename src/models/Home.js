import connection from "../config/db";
const HomeModle = {
  getAllCities: (callback) => {
    const query = "SELECT * FROM city WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
  getAllDistricts: (CityId, callback) => {
    const query = "SELECT * FROM district WHERE CityId = ? AND IsDeleted = 0";
    connection.query(query, CityId, callback);
  },
  getAllWards: (DistrictId, callback) => {
    const query = "SELECT * FROM ward WHERE DistrictId = ? AND IsDeleted = 0";
    connection.query(query, DistrictId, callback);
  },
  getAllObjects: (callback) => {
    const query = "SELECT * FROM object WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
  getAllFields: (callback) => {
    const query = "SELECT * FROM field WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
  getAllApartment: (callback) => {
    const query = "SELECT * FROM apartment WHERE IsDeleted = 0";
    connection.query(query, callback);
  },
};
export default HomeModle;
