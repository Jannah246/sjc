export enum Env {
  DEV = "development",
  PROD = "production",
  STAGE = "staging",
}

export enum Status {
  UNAUTHORISED = "UNAUTHORISED",
}

export enum ErrorTypes {
  UNAUTHORISED_ERROR = "UnauthorizedError",
}

export enum PosCategoryEnum {
  ONSITE = 1,
  OFFSITE = 2,
  OFFLINE = 3,
}

export enum RechargeTypeEnum {
  POS_TOP_UP = "POS Top Up",
  POS_TRANSFER = "POS Transfer",
  ONLINE_PAYMENT = "Online payment",
  REFUND = "Refund",
}

export enum Roles {
  ROLE_CLIENT_ADMIN = "ROLE_CLIENT_ADMIN",
  ROLE_INVESTOR = "ROLE_INVESTOR",
  ROLE_POS = "ROLE_POS",
  ROLE_COORDINATOR = "ROLE_COORDINATOR",
  ROLE_ACCOUNTANT = "ROLE_ACCOUNTANT",
  ROLE_PLANT_MANAGER = "ROLE_PLANT_MANAGER",
  ROLE_STORE_MANAGER = "ROLE_STORE_MANAGER",
  ROLE_KITCHEN_MANAGER = "ROLE_KITCHEN_MANAGER",
}

export enum InternetPackageType {
  FIXED_DURATION = "fixed_duration",
}

export enum OrderStatus {
  active = 1,
  expire = 2,
  pending = 3,
}

export enum CreatedByUserType {
  pos = "pos",
  user = "user",
}

export enum RefundType {
  internet_package = "internet_package",
}
