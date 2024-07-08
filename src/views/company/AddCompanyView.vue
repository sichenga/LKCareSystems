<template>
  <div class="app-container">
    <!-- 新增分机构 -->
    <el-card style="max-width: 100%">
      <div class="title">
        <div class="title-text">
          <span>▋</span>
          基础信息
        </div>
        <div class="title-btn">
          <el-button @click="cancel">取消</el-button>
          <el-button type="primary" @click="save(oneRef)">保存</el-button>
        </div>
      </div>
      <div class="form-size">
        <el-form
          ref="oneRef"
          :inline="true"
          :rules="rules"
          label-position="top"
          :model="params"
          class="demo-form-inline"
        >
          <el-form-item label="机构名称:" prop="name">
            <el-input v-model="params.name" placeholder="请输入" clearable />
          </el-form-item>

          <el-form-item label="选择省份" prop="province">
            <el-cascader
              :props="props"
              :options="options"
              v-model="cityData"
              @change="cityChange"
              style="width: 100%"
            />
          </el-form-item>
          <el-form-item label="地址:" prop="address">
            <el-input v-model="params.address" laceholder="请输入" clearable />
          </el-form-item>
          <el-form-item label="对外服务电话:" prop="telephone">
            <el-input
              v-model="params.telephone"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="管理员姓名：" prop="adminName">
            <el-input
              v-model="params.adminName"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="联系方式：" prop="adminMobile">
            <el-input
              v-model="params.adminMobile"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="账号:" prop="adminUserName">
            <el-input
              v-model="params.adminUserName"
              placeholder="请输入"
              clearable
            />
          </el-form-item>
          <el-form-item label="密码:" prop="adminPwd">
            <el-input
              v-model="params.adminPwd"
              show-password
              placeholder="请输入"
              clearable
            />
          </el-form-item>

          <el-form-item label="开业时间:" prop="startTime">
            <MayTimePicker v-model="params.startTime" />
          </el-form-item>
        </el-form>
      </div>
      <div class="title-text">
        <span>▋</span>
        经营信息
      </div>
      <div class="form-size">
        <el-form
          :inline="true"
          :rules="rules"
          label-position="top"
          :model="params"
          ref="ruleFormRef"
          class="demo-form-inline"
        >
          <el-form-item label="法人代表：" prop="legalPerson">
            <el-input
              v-model="params.legalPerson"
              placeholder="请输入法人"
              clearable
            />
          </el-form-item>
          <el-form-item label="法人代表联系号码:" prop="mobile">
            <el-input
              v-model="params.mobile"
              placeholder="请输入法人联系号码"
              clearable
            />
          </el-form-item>
          <el-form-item label="统一社会信用代码" prop="creditCode">
            <el-input
              v-model="params.creditCode"
              placeholder="请输入统一社会信用码"
              clearable
            />
          </el-form-item>
        </el-form>
        <el-form
          :inline="true"
          :rules="rules"
          label-position="right"
          :model="params"
          ref="towRef"
          class="demo-form-inline"
        >
          <el-form-item label="卫生许可证" prop="license">
            <el-radio-group v-model="params.license">
              <el-radio :value="0">是</el-radio>
              <el-radio :value="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="是否具备医疗定点资格：" prop="medicalPoint">
            <el-radio-group v-model="params.medicalPoint">
              <el-radio :value="0">是</el-radio>
              <el-radio :value="1">否</el-radio>
            </el-radio-group>
          </el-form-item>
          <el-form-item label="房屋性质：" prop="house">
            <el-radio-group v-model="params.house">
              <el-radio :value="0">自有产权</el-radio>
              <el-radio :value="1">租赁</el-radio>
              <el-radio :value="2">合作使用</el-radio>
              <el-radio :value="3">其他</el-radio>
            </el-radio-group>
          </el-form-item>
        </el-form>
        <el-form
          :inline="true"
          :rules="rules"
          label-position="top"
          :model="params"
          ref="threeRef"
          class="demo-form-inline"
        >
          <el-form-item label="营业执照：">
            <!-- <MassUpload
              @upload="uploadimg"
              @uploadrem="uploadrem"
              :showlist="getMassUpload"
            /> -->
            <AvatarUpload @upload="uploadimg" :editdata="getMassUpload" />
          </el-form-item>
          <el-form-item label="机构图片:">
            <UploadPictures
              :limit="3"
              class="uploadpic"
              @upload="pictureupload"
              @uploadrem="picturerem"
              :showlist="getUploadPictures"
            />
          </el-form-item>
        </el-form>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import type { UploadUserFile } from "element-plus";
import type { FormInstance, FormRules } from "element-plus";
import {
  companyadd,
  companyget,
  getCity,
} from "@/service/Organization/OrganizationApi";
import type { companyaddParams } from "@/service/Organization/OrganizationType";
import MayTimePicker from "@/components/timepicker/MayTimePicker.vue";
import { useRouter } from "vue-router";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
const upload = import.meta.env.VITE_BASE_URL;

const UploadPictures = defineAsyncComponent(
  () => import("@/components/upload/UploadPictures.vue")
);
const AvatarUpload = defineAsyncComponent(
  () => import("@/components/upload/AvatarUpload.vue")
);

const route = useRoute();
const router = useRouter();
const ruleFormRef = ref<FormInstance>();
const towRef = ref<FormInstance>();
const threeRef = ref<FormInstance>();
const oneRef = ref<FormInstance>();
const data = reactive({
  id: " " as any,
});
const getMassUpload = ref<any>("");
const getUploadPictures = ref<UploadUserFile[]>([]);
// 省会选择值
const cityData = ref<any>([]);
const params = reactive<companyaddParams>({
  id: data.id,
  name: "",
  address: "",
  telephone: "",
  adminName: "",
  adminMobile: "",
  adminUserName: "",
  adminPwd: "",
  startTime: "",
  legalPerson: "", //法人
  mobile: "", //法人联系号码
  creditCode: "", //统一社会信用代码
  license: null, //卫生许可证
  medicalPoint: null, //医疗点
  house: "", //房屋性质
  certificate: null, //营业执照
  picture: "", //机构图片
  province: "",
  city: "",
});
// 添加营业执照
const uploadimg = (val: any) => {
  params.certificate = val?.url;
};
// 级联选择器配置
const props = {
  label: "n",
  value: "n",
  children: "c",
};

const options = ref<any>([]);
// 获取省会数据
const getOptions = async () => {
  const res: any = await getCity();
  console.log(111, res);
  if (res?.code === 10000) {
    options.value = res.data;
  }
};
const cityChange = (val: any) => {
  params.province = val[0];
  params.city = val[1];
};
// 增加机构图片
const pictureupload = (val: any) => {
  console.log(val);
  params.picture = (params.picture ? params.picture + "," : "") + val?.url;
  console.log(params.picture);
};

// 移除机构图片
const picturerem = (val: any) => {
  console.log(val);
  // console.log()
  params.picture = params.picture
    .split(",")
    .filter((item: any) => item !== val)
    .join(",");
  console.log(1111, params.picture);
};

const rules = reactive<FormRules<companyaddParams>>({
  name: [{ required: true, message: "请输入机构名称", trigger: "blur" }],
  address: [{ required: true, message: "请选择地址", trigger: "blur" }],
  telephone: [
    { required: true, message: "请输入对外服务电话", trigger: "blur" },
  ],
  adminName: [{ required: true, message: "请输入管理员姓名", trigger: "blur" }],
  adminMobile: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
  adminUserName: [{ required: true, message: "请输入账号", trigger: "blur" }],
  adminPwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
  startTime: [{ required: true, message: "请选择开业时间", trigger: "change" }],
  province: [{ required: true, message: "请选择省份", trigger: "change" }],
});
//保存
const save = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  let valid = await formEl.validate();
  if (valid) {
    const res: any = await companyadd(params).catch(() => {});
    console.log(res);
    console.log("====================================");
    console.log(params?.id);
    console.log("====================================");
    if (res?.code === 10000) {
      ElMessage.success(params.id! > 0 ? "修改成功" : "添加成功");
      cancel();
    } else {
      ElMessage.error(res.msg);
    }
  }
};
//取消
const cancel = () => {
  router.push({
    path: "/company/list",
  });
};
//数据回显
const getcompanyget = async () => {
  data.id = route.params?.id;
  console.log(route.params?.id);
  if (data.id) {
    const res: any = await companyget(data.id);
    console.log("单条数据", res);
    Object.assign(params, res.data);
    cityData.value = [res.data?.province, res.data?.city];
    if (res.data.certificate) {
      getMassUpload.value = res.data.certificate;
    }
    // 图片回显
    if (res.data.picture) {
      getUploadPictures.value = res.data.picture
        .split(",")
        .map((item: any) => ({
          url: upload + "/" + item,
          name: item,
        }));
    }
  }
};

onMounted(() => {
  getOptions();
  getcompanyget();
});
</script>
<style lang="less" scoped>
.section {
  width: 100%;
  height: 819px;
  background-color: #fff;
}

.title-text {
  margin: 40px;

  span {
    color: #409eff;
  }
}

.title {
  display: flex;
  justify-content: space-between;
  height: 57px;

  .title-btn {
    margin: 40px;

    .el-button {
      width: 100px;
      height: 40px;
    }
  }
}

.el-form-item {
  width: 479px;
  margin-top: 40px;
  margin-left: 40px;
}

.el-form-item:nth-child(n + 4) {
  margin-top: 20px;
}

.button {
  width: 92px;
  height: 40px;
}

.uploadpic {
  :deep(.el-upload-list) {
    display: flex;

    left: 100px;
    top: -100px;
  }
  :deep(.el-upload) {
    justify-content: flex-start;
  }
}
</style>
