import Accountant from "./accountant.model";
import Admin from "./admin.model";
import Camp from "./camp.model";
import Client from "./client.model";
import Coordinator from "./coordinator.model";
import Role from "./role.model";
import Pos from "./pos.model";
import PosDeviceCode from "./pos_device_code.model";
import PosDeviceCodeHistory from "./pos_device_code_history.model";
import InternetPackage from "./internet_package.model";
import InternetPackageAssignClient from "./internet_package_assign_client.model";
import CampAssignPosDeviceModel from "./camp_assign_pos_device.model";
import PosAssignPosDeviceModel from "./pos_assign_pos_device.model";
import CampAssignPosModel from "./camp_assign_pos.model";
import InternetPackageClient from "./internet_package_client.model";
import InternetPackageAssignCamps from "./internet_package_assign_camps.model";
import UserRegisterModel from "./user_register.model";
import UserCampModel from "./user_camp.model";
import CountriesModel from "./countries.model";
import NationalTypeModel from "./national_type.model";
import UserRechargeModel from "./user_recharge.model";
import CampAssignCoordinatorModel from "./camp_assign_coordinator.model";
import CampAssignAccountantModel from "./camp_assign_accountant.model";
import InvestorsModel from "./investors.model";
import UserWalletModel from "./user_wallet.model";
import OrderInternetPackageModel from "./order_internet_package.model";
import PlantManagerModel from "./plant_manager.model";

export default {
  accountantModel: Accountant,
  adminModel: Admin,
  campModel: Camp,
  clientModel: Client,
  coordinatorModel: Coordinator,
  roleModel: Role,
  posModel: Pos,
  posDeviceCodeModel: PosDeviceCode,
  posDeviceCodeHistoryModel: PosDeviceCodeHistory,
  internetPackageModel: InternetPackage,
  InternetPackageAssignClientModel: InternetPackageAssignClient,
  campAssignPosDeviceModel: CampAssignPosDeviceModel,
  posAssignPosDeviceModel: PosAssignPosDeviceModel,
  campAssignPosModel: CampAssignPosModel,
  InternetPackageClientModel: InternetPackageClient,
  InternetPackageAssignCampsModel: InternetPackageAssignCamps,
  userRegisterModel: UserRegisterModel,
  userCampModel: UserCampModel,
  countriesModel: CountriesModel,
  nationalTypeModel: NationalTypeModel,
  userRechargeModel: UserRechargeModel,
  campAssignCoordinatorModel: CampAssignCoordinatorModel,
  campAssignAccountantModel: CampAssignAccountantModel,
  investorsModel: InvestorsModel,
  userWalletModel: UserWalletModel,
  orderInternetPackageModel: OrderInternetPackageModel,
  plantManagerModel: PlantManagerModel,
};
