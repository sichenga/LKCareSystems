<template>
  <!-- 新增员工 编辑 -->
  <div class="app-container">
    <div class="box">
      <el-form
        ref="ruleFormRef"
        style="max-width: 600px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="员工头像:" prop="name">
          <AvatarUpload @upload="pictureupload" :editdata="getUploadPictures" />
        </el-form-item>
        <el-form-item label="员工姓名:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入员工姓名" />
        </el-form-item>
        <el-form-item label="联系方式:" prop="mobile">
          <el-input v-model="ruleForm.mobile" placeholder="请输入联系方式" />
        </el-form-item>
        <el-form-item label="身份证号:" prop="idCard">
          <el-input v-model="ruleForm.idCard" placeholder="请输入身份证号" />
        </el-form-item>
        <el-form-item label="所属部门:" prop="departmentId">
          <el-select v-model="ruleForm.departmentId" placeholder="请选择">
            <el-option
              v-for="item in departmentData"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="所属岗位:">
          <el-select
            v-model="ruleForm.roles"
            multiple
            placeholder="请选择所属岗位"
            style="width: 240px"
          >
            <el-option
              v-for="item in Roles"
              :key="item.id"
              :label="item.name"
              :value="item.id"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="账号:" prop="adminUserName">
          <el-input v-model="ruleForm.adminUserName" placeholder="请输入账号" />
        </el-form-item>
        <el-form-item label="密码:" prop="adminPwd">
          <el-input v-model="ruleForm.adminPwd" placeholder="请输入密码" />
        </el-form-item>
        <el-form-item label="是否护工:" prop="isCarer">
          <el-radio-group v-model="ruleForm.isCarer">
            <el-radio :value="1">是</el-radio>
            <el-radio :value="0">否</el-radio>
          </el-radio-group>
        </el-form-item>
      </el-form>
    </div>
    <div class="button">
      <el-button @click="resetForm">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, ref, onMounted, defineAsyncComponent } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { useRoute, useRouter } from "vue-router";
import type { RuleForm } from "@/service/staff/StaffType";
import {
  staffAdd,
  departmentList,
  staffId,
  updateList,
} from "@/service/staff/StaffApi";
import { RoleList } from "@/service/role/RoleApi";
const route = useRoute();

const getUploadPictures = ref<any>("");
const router = useRouter();
const AvatarUpload = defineAsyncComponent(
  () => import("@/components/upload/AvatarUpload.vue")
);

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  photo: "",
  name: "", //姓名
  mobile: "", //手机号
  enable: null, //是否禁用
  departmentId: null, //部门id
  adminUserName: "", //用户名
  adminPwd: "", //密码
  isCarer: null, //是否护工
  idCard: "", //身份证
  roles: [], //角色
});
const rules = reactive<FormRules<RuleForm>>({
  name: [{ required: true, message: "请输入员工名", trigger: "blur" }],
  idCard: [{ required: true, message: "请输入身份证", trigger: "blur" }],
  mobile: [{ required: true, message: "请输入手机号", trigger: "blur" }],
  adminUserName: [{ required: true, message: "请输入账号", trigger: "blur" }],
  adminPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
  departmentId: [
    {
      required: true,
      message: "请选择所属部门",
      trigger: "change",
    },
  ],
  isCarer: [
    {
      required: true,
      message: "是否护工",
      trigger: "change",
    },
  ],
});
// 员工头像
const pictureupload = (val: any) => {
  ruleForm.photo = val;
  console.log(ruleForm);
};

const resetForm = () => {
  router.push({
    path: "/personel/staff",
  });
};
//所属部门
const departmentData: any = ref([]);
const partmentList = async () => {
  let res: any = await departmentList();
  if (res.code === 10000) {
    departmentData.value = res.data.list;
  }
};
//所属岗位
const Roles: any = ref([]);
const RoleListData = async () => {
  let res: any = await RoleList();
  if (res.code) {
    Roles.value = res.data.list;
  }
};

// 根据id获取单挑数据
const staffIds = async () => {
  if (route.params?.id) {
    let ids = Number(route.params?.id);
    let res: any = await staffId(ids).catch(() => {});
    console.log(res);
    if (res?.code === 10000) {
      Object.assign(ruleForm, res.data);
      ruleForm.roles = res.data.roles.map((item: any) => item.id);
      getUploadPictures.value = res.data.photo;
    }
  }
};

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      // ruleForm.roles = ruleForm.roles.map((item: any) => ({ id: item }))
      let obj = {
        ...ruleForm,
        roles: ruleForm.roles.map((item: any) => ({ id: item })),
      };
      let res: any;
      if (route.params?.id) {
        //修改员工
        res = await updateList(obj);
        console.log(res);
      } else {
        //添加员工
        res = await staffAdd(obj);
      }
      if (res?.code == 10000) {
        router.push({
          path: "/personel/staff",
        });
        ElMessage.success(route.params?.id ? "修改成功" : "添加成功");
      } else {
        ElMessage.error(res?.msg);
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
// api接口
const Api = () => {
  partmentList(); //所属部门
  RoleListData(); //所属岗位
  staffIds(); //根据id获取单挑数据
};

onMounted(() => {
  Api();
});
</script>

<style scoped lang="less">
.box {
  background-color: #fff;
  padding: 20px;
}

.el-form-item {
  width: 400px;
}

.button {
  text-align: center;
  margin-top: 40px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}
</style>

<style>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}
</style>
