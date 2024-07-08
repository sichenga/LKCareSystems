export interface companylistParams {
  page: number;
  pageSize: number;
  key?: string;
  name?: string;
}
//添加机构
export interface companyaddParams {
  id: number | null;
  name: string;
  address: string;
  telephone: string | null;
  adminName: string;
  adminMobile: string;
  adminUserName: string;
  adminPwd: string;
  startTime: string | null;
  legalPerson: string | null; //法人
  mobile: string | null; //法人联系号码
  creditCode: string | null; //统一社会信用代码
  license: number | null; //卫生许可证
  medicalPoint: number | null; //医疗点
  house: string | null; //房屋性质
  certificate: string | null; //营业执照
  picture: string; //机构图片
  province: string;
  city: string;
}
