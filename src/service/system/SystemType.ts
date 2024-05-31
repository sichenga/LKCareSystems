// 账号设置
export interface RuleForm {
  name: string;
  mobile: string;
  username: string;
  pwd: string;
  roleIds: string;
}
//修改密码
export interface RuleFormPwd {
  pwd: string; //旧密码
  newPwd: string; //新密码
  newpass: string; //再次输入新密码
}
