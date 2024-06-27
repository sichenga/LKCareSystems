<template>
  <el-dialog
    v-model="dialogVisible"
    :title="params.id == 0 ? '新增机构' : '编辑机构'"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      :model="params"
      :rules="rules"
      :size="formSize"
      class="demo-ruleForm"
      label-width="auto"
      status-icon
      style="max-width: 400px"
    >
      <el-form-item label="机构名称" prop="name">
        <el-input v-model="params.name" placeholder="请输入机构名称" />
      </el-form-item>
      <el-form-item label="所属区域" prop="address">
        <el-input v-model="params.address" placeholder="请输入所属区域" />
      </el-form-item>
      <el-form-item label="管理员名称" prop="adminName">
        <el-input v-model="params.adminName" placeholder="请输入管理员名称" />
      </el-form-item>
      <el-form-item label="联系电话" prop="adminMobile">
        <el-input v-model="params.adminMobile" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="管理员账号" prop="adminUserName">
        <el-input
          v-model="params.adminUserName"
          placeholder="请输入管理员账号"
        />
      </el-form-item>
      <el-form-item label="管理员密码" prop="adminPwd">
        <el-input v-model="params.adminPwd" placeholder="请输入管理员密码" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submit(ruleFormRef)">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { companyadd, companyget } from "@/service/Organization/OrganizationApi";
import type { companyaddParams } from "@/service/Organization/OrganizationType";

const props = defineProps(["id"]);

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const params = reactive<companyaddParams>({
  id: props.id,
  name: "",
  address: "",
  telephone: null,
  adminName: "",
  adminMobile: "",
  adminUserName: "",
  adminPwd: "",
  startTime: null,
  legalPerson: null, //法人
  mobile: null, //法人联系号码
  creditCode: null, //统一社会信用代码
  license: null, //卫生许可证
  medicalPoint: null, //医疗点
  house: null, //房屋性质,
  certificate: null,
  picture: "",
});
const rules = reactive<FormRules<companyaddParams>>({
  name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
  address: [{ required: true, message: "请选择地址", trigger: "blur" }],
  adminName: [{ required: true, message: "请输入管理员姓名", trigger: "blur" }],

  adminMobile: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
  adminUserName: [{ required: true, message: "请输入账号", trigger: "blur" }],
  adminPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
});
//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
const submit = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (params.id == 0) {
        const res: any = await companyadd(params).catch(() => {});
        console.log(res);
        if (res.code === 10000) {
          ruleFormRef.value && ruleFormRef.value.resetFields();
          ElMessage({
            message: res.msg,
            type: "success",
          });
          emit("close", true);
        } else {
          ElMessage({
            message: "添加失败",
            type: "error",
          });
        }
      } else {
        const res: any = await companyadd(params).catch(() => {});
        console.log("修改", res);
        if (res.code === 10000) {
          ruleFormRef.value && ruleFormRef.value.resetFields();
          ElMessage({
            message: res.msg,
            type: "success",
          });
          emit("close", true);
        } else {
          ElMessage({
            message: "添加失败",
            type: "error",
          });
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const getcompanyget = async () => {
  if (params.id) {
    const res: any = await companyget(params.id);
    console.log("单条数据", res);
    Object.assign(params, res.data);
  }
};

onMounted(() => {
  getcompanyget();
});
</script>

<style lang="less" scoped></style>
