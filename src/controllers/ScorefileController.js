import EmployeeModle from "../models/Employee";
import ScorefileModle from "../models/Scorefile";
import ScoretempModle from "../models/Scoretemp";
import CriteriaModle from "../models/Criteria";
import generateRandomString from "../middlewares/generate";
import jwt from "jsonwebtoken";
class ScorefileController {
  // lấy tất cả phiếu
  async getScorefile_ByEmployeeId(req, res) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let id = par._id;
    var IdAdmin;
    try {
      const InfoEmployee = await EmployeeModle.getOneEmployeeById(id);
      const CityId = InfoEmployee[0]?.CityId;
      const DistrictId = InfoEmployee[0]?.DistrictId;
      const ApartmentId = InfoEmployee[0].ApartmentId;
      const RoleId = InfoEmployee[0].RoleId;
      if (ApartmentId == 1) {
        const EmployeeAdmin = await EmployeeModle.getOne_Admin_City(
          CityId,
          ApartmentId
        );
        IdAdmin = EmployeeAdmin[0]?._id;
      } else if (ApartmentId == 2) {
        const EmployeeAdmin = await EmployeeModle.getOne_Admin_District_Or_Ward(
          CityId,
          DistrictId,
          ApartmentId
        );
        IdAdmin = EmployeeAdmin[0]?._id;
      } else {
        IdAdmin = id;
      }

      ScorefileModle.getScorefile_ByEmployee(
        IdAdmin,
        RoleId,
        (err, results) => {
          if (err) {
            console.log("Error", err);
          } else {
            res.status(200).json(results);
          }
        }
      );
    } catch (error) {
      console.log("Error", error);
    }
  }
  // chi tiết phiếu theo Employee và Field
  async getOne_Scorefile_ByEmployeeAndField(req, res) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let idEmployee = par._id;
    const idScorefile = req.params.id;
    // lấy Admin theo idEmployee
    var IdAdmin;
    try {
      const InfoEmployee = await EmployeeModle.getOneEmployeeById(idEmployee);
      const CityId = InfoEmployee[0]?.CityId;
      const DistrictId = InfoEmployee[0]?.DistrictId;
      const ApartmentId = InfoEmployee[0]?.ApartmentId;
      if (ApartmentId == 1) {
        const EmployeeAdmin = await EmployeeModle.getOne_Admin_City(
          CityId,
          ApartmentId
        );
        IdAdmin = EmployeeAdmin[0]?._id;
      } else if (ApartmentId == 2) {
        const EmployeeAdmin = await EmployeeModle.getOne_Admin_District_Or_Ward(
          CityId,
          DistrictId,
          ApartmentId
        );
        IdAdmin = EmployeeAdmin[0]?._id;
      } else {
        IdAdmin = idEmployee;
      }

      //từ employee -> fieldId
      const ListField = await EmployeeModle.getAll_FieldEmployee(idEmployee);

      const FieldId = [];
      ListField.map((item) => {
        FieldId.push(item.FieldId);
      });
      //từ scorefile ->scoretemp
      const scorefile = await ScorefileModle.getScoreTempId_IdScorefile(
        idScorefile
      );
      const ScoreTempId = scorefile[0].ScoreTempId;
      // từ criteria -> id criteria
      const criteria = await CriteriaModle.getCiteria_ByScoreTemId_FieldId(
        ScoreTempId,
        FieldId
      );
      const CriteriaId = [];
      criteria.map((item) => {
        CriteriaId.push(item._id);
      });

      // lấy dc Id_criteriaDetail
      if (CriteriaId.length > 0) {
        const results =
          await CriteriaModle.getDetailCriteria_ScorefileDetail_ByCriteriaId(
            idScorefile,
            CriteriaId,
            IdAdmin
          );
        let data = {
          ScorefileId: idScorefile,
          NameScoreTemp: scorefile[0].NameScoreTemp,
          Criteria: [],
        };
        const CriteriaMap = new Map();
        results.forEach((element) => {
          if (!CriteriaMap.has(element.IdCriteria)) {
            CriteriaMap.set(element.IdCriteria, {
              _id: element._id,
              Name: element.NameCriteria,

              listCriteria: [],
            });
          }
          const getCriteriatoMap = CriteriaMap.get(element.IdCriteria);
          getCriteriatoMap.listCriteria.push({
            _id: element.IdScoreFile_Detail,
            Name: element.Name,
            Target: element.Target,
            IsTypePercent: element.IsTypePercent,
            IsTypeTotal: element.IsTypeTotal,
            IsCurrentStatusType: element.IsCurrentStatusType,
            TypePercentValue: element.TypePercentValue,
            TypeTotalValue: element.TypeTotalValue,
            CurrentStatusValue: element.CurrentStatusValue,
          });
        });
        data.Criteria = Array.from(CriteriaMap.values());
        res.status(200).json(data);
      } else {
        res.status(500).json({
          message: "Phiếu này không có lĩnh vực phù hợp với tài khoản",
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
  // Tạo phiếu cho xã và admin 
  async create_Scorefile(req, res) {
    const { EmployeeId, YearId, ObjectId } = req.body;
    // danh sách tạo scorefile
    const ListScoreTempIds = [];
    // xóa những scorefile k có trong mảng
    const ListScoreTempIdsToRemove = [];
    const ListdataIds = [];
    try {
      // kiểm tra xem phiếu đã có chưa ?
      const datas = await ScoretempModle.getScoreTemp_YearAndObject_to_get_id(
        ObjectId,
        YearId
      );
      datas.map((data) => {
        ListdataIds.push(data._id);
      });
      for (const scoretempId of ListdataIds) {
        const dataScorefile =
          await ScorefileModle.getScorefile_ScoreTempId_EmployeeId_YearId(
            scoretempId,
            EmployeeId,
            YearId
          );
        if (dataScorefile.length === 1) {
          ListScoreTempIdsToRemove.push(scoretempId);
        } else if (dataScorefile.length === 0) {
          //chưa có push vào mảng
          ListScoreTempIds.push(scoretempId);
        }
      }
      if (ListScoreTempIdsToRemove > 0) {
        // xóa những scorefile k được nhận
        await ScorefileModle.deleteScorefile_ScoretempId_EmployeeId_YearId(
          ListScoreTempIdsToRemove,
          EmployeeId,
          YearId
        );
        res.status(200).json({
          message: "Phát phiếu thành công",
        });
      }

      // kiểm tra nếu như mảng id đã có được tạo hết chưa
      if (ListScoreTempIds.length === 0) {
        res.status(400).json({
          message: "Các phiếu đã được phát rồi !",
        });
      } else {
        const objectIds = await ScoretempModle.getObjectId_scoretempIdAndYearId(
          ListScoreTempIds,
          YearId
        );
        // lấy danh sách các object chưa được tạo
        const ListObjectId = [];
        objectIds.map((item) => {
          ListObjectId.push(item.ObjectId);
        });
        // lấy phiếu theo object để tạo scorefile
        const results = await ScoretempModle.getOneScoretemp_to_YearAndObject(
          ListObjectId,
          YearId
        );
        const data = {
          scorefile: [],
        };
        const ScorefileMap = new Map();
        results.map((item) => {
          if (!ScorefileMap.has(item._id)) {
            ScorefileMap.set(item._id, {
              ScoreTempId: item._id,
              EmployeeId: EmployeeId,
              Code: generateRandomString(6),
              YearId: YearId,
              listScoreFileDetail: [],
            });
          }
          const scorefileDetail = ScorefileMap.get(item._id);
          scorefileDetail.listScoreFileDetail.push({
            CriteriaDetailId: item.ScoretempDetail_id,
            EmployeeId: EmployeeId,
          });
        });
        data.scorefile = Array.from(ScorefileMap.values());
        //danh sách phát phiếu
        const ListData = data.scorefile;

        // tạo phiếu
        for (const element of ListData) {
          const form = {
            EmployeeId: element.EmployeeId,
            ScoreTempId: element.ScoreTempId,
            CreatorId: element.EmployeeId,
            YearId: element.YearId,
            Code: element.Code,
          };
          // tạo scorefile
          const dataScorefile = await ScorefileModle.createScorefile(form);
          // lấy id của scorefile
          const ScorefileId = dataScorefile.insertId;
          if (element.listScoreFileDetail) {
            for (const item of element.listScoreFileDetail) {
              const forms = {
                ScorefileId: ScorefileId,
                CriteriaDetailId: item.CriteriaDetailId,
                EmployeeId: item.EmployeeId,
              };
              await ScorefileModle.creatScoreFile_Detail(forms);
            }
          }
        }
        res.status(200).json({
          message: "Phát phiếu thành công",
        });
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
  // xã tạo phiếu cho huyện || tỉnh
  async create_scorefile_forAdminDistrict(req, res) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let id = par._id;
    const IdScorefile = req.params.id;
    try {
      const CreatedscoreFile =
        await ScorefileModle.getOne_Scorefile_ScorefileId(IdScorefile);
      //kiểm tra xem phiếu dc gửi chưa
      if (CreatedscoreFile.length > 0) {
        res.status(400).json({ message: "Đã gửi phiếu!" });
      } else {
        // update IsSend -> chuyển trạng thái đã gửi
        await ScorefileModle.update_IsSend_Scorefile_sent(IdScorefile);

        // lấy thông tim tài khoản xã gửi
        const datas = await EmployeeModle.getOneEmployeeById(id);
        const CityId = datas[0]?.CityId;
        const DistrictId = datas[0]?.DistrictId;

        // nếu là tk xã -> lấy admin huyện apartment = 2
        const AdminEmployee =
          datas[0]?.ApartmentId == 3
            ? await EmployeeModle.getOne_Admin_District_Or_Ward(
                CityId,
                DistrictId,
                2
              )
            : // nếu là tk huyện -> lấy admin huyện apartment = 1
              await EmployeeModle.getOne_Admin_City(CityId, 1);
        // lấy Id của Admin huyện để tạo scorefile
        const IdAdmin = AdminEmployee[0]?._id;

        // lấy scorefile
        const InfoScoreFile =
          await ScorefileModle.getOneScorefile_ById_byActiveAndStatus(
            IdScorefile
          );
        // xem phiếu xã đã được duyệt và đã chấm xong chưa
        if (InfoScoreFile.length > 0) {
          //lấy scoretempId
          const ScoreTempId = InfoScoreFile[0]?.ScoreTempId;

          const InfoScoreTemp = await ScoretempModle.getOne_InfoScoretemp(
            ScoreTempId
          );
          const form = {
            EmployeeId: IdAdmin,
            ScoreTempId: ScoreTempId,
            CreatorId: id,
            ScorefileId_Sent: IdScorefile,
            YearId: InfoScoreTemp[0]?.YearId,
            Code: generateRandomString(6),
          };
          // tạo scorefile
          const results = await ScorefileModle.createScorefile(form);
          // tạo scorefileDetail
          for (const item of InfoScoreTemp) {
            const formScoreFileDetail = {
              ScorefileId: results.insertId,
              CriteriaDetailId: item.CriteriaDetail_id,
              EmployeeId: IdAdmin,
            };
            await ScorefileModle.creatScoreFile_Detail(formScoreFileDetail);
          }

          res.status(200).json({ message: "Gửi phiếu thành công" });
        } else {
          res
            .status(400)
            .json({ message: "Phiếu chưa chấm xong hoặc chưa được duyệt!" });
        }
      }
    } catch (error) {
      console.log("Error", error);
    }
  }
  // update active
  async update_ActiveScorefile(req, res) {
    let token = req.cookies[process.env.COOKIE];
    let par = jwt.verify(token, process.env.SECRET);
    let idEmployee = par._id;
    const idScorefile = req.params.id;
    // từ scorefile -> Idscorefile đã gửi->đổi status đã nhận
    try {
      const results = await ScorefileModle.getScorefile_ById(idScorefile);
      if (results[0].ScorefileId_Sent) {
        await ScorefileModle.update_IsSend_Scorefile_confirmed(
          results[0].ScorefileId_Sent
        );
      }
      await ScorefileModle.update_ActiveScorefile(idScorefile, idEmployee);
      res.status(200).json({ message: "Duyệt phiếu thành công" });
    } catch (error) {
      console.log("Error", error);
    }
  }
  // chấm điểm
  async update_Scorefile(req, res) {
    const scorefileId = req.body.scoreFileId;
    const listScoreFileDetail = req.body.listScoreFileDetail;
    try {
      await ScorefileModle.updateScorefile(scorefileId, {
        Status: req.body.Status,
      });
      for (const item of listScoreFileDetail) {
        const form = {
          TypePercentValue: item.TypePercentValue,
          TypeTotalValue: item.TypeTotalValue,
          CurrentStatusValue: item.CurrentStatusValue,
        };
        await ScorefileModle.updateScorefile_Detail(
          item.scorefileDetailId,
          form
        );
      }
      res.status(200).json({
        message: "Chấm điểm thành công",
      });
    } catch (error) {
      console.log("Error", error);
    }
  }
  deleteOne_Scorefile(req, res) {
    const id = req.params.id;
    ScorefileModle.deleteScorefile(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json("Xóa thành công");
      }
    });
  }
  delete_selected_Scorefile(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    ScorefileModle.deleteScorefile(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json("Xóa thành công");
      }
    });
  }
  restoreOne_Scorefile(req, res) {
    const id = req.params.id;
    ScorefileModle.restoreScorefile(id, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json("Khôi phục thành công");
      }
    });
  }
  restore_selected_Scorefile(req, res) {
    const ids = req.body;
    let idString = ids.map(String);
    ScorefileModle.restoreScorefile(idString, (err, results) => {
      if (err) {
        console.log("Error", err);
      } else {
        res.status(200).json("Khôi phục thành công");
      }
    });
  }
}
export default new ScorefileController();
