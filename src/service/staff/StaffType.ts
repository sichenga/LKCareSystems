// 添加部门  /api/department/add
export interface AddDepartmentParams {
  id: number;
  name: string;
  pid: number;
}

// 修改部门  /api/department/update
export interface UpdateDepartmentParams {
  id: number;
  name: string;
  pid: number;
}

// 部门列表
export interface DepartmentListParams {
  id: number;
  companyId: number;
  name: string;
  pid: number;
  children?: Array<DepartmentListParams>;
}
// 员工列表
export interface StaffListParams {
  page: number;
  pageSize: number;
  name?: string | undefined; //员工姓名
  mobile?: string | undefined; //联系方式
  idCard?: string | undefined; //身份证号
  departmentId?: number | null; //部门id
  roleId?: number | null; //岗位id
  enable?: number | null; //状态
  carer?: number | null; //是否是护工1是
}

//添加员工
interface FormData {
  id: string;
}
export interface RuleForm {
  //添加员工
  photo: string;
  name: string;
  mobile: string;
  enable: number | null;
  departmentId: number | null;
  adminUserName: string;
  adminPwd: string;
  isCarer: number | null;
  idCard: string;
  roles: Array<FormData>;
}
