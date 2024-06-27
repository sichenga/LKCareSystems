<template>
  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id == 0 ? '新增房间' : '编辑房间'"
    width="500"
    @close="close"
  >
    <!-- {{ ruleForm }} -->
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :size="formSize"
      class="demo-ruleForm"
      label-width="auto"
      status-icon
      style="max-width: 295px"
    >
      <el-form-item label="房间号" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入房间号" />
      </el-form-item>
      <el-form-item label="房间类型" prop="type">
        <el-select
          v-model="ruleForm.type"
          placeholder="请选择"
          style="width: 240px"
        >
          <el-option
            v-for="item in state.getHouseTypelist"
            :key="item.value"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="所属楼层" prop="buildingId">
        <MayCascader
          :emitid="ruleForm.buildingId"
          :options="options"
          @change="houseselect"
        />
      </el-form-item>
      <el-form-item label="床位数" prop="beds">
        <el-input v-model="ruleForm.beds" placeholder="请输入床位数" />
      </el-form-item>
      <el-form-item label="房间图片" prop="picture">
        <AvatarUpload :editdata="emitUpload" @upload="uploadimg" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >确定</el-button
        >
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineAsyncComponent, onMounted, reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
//添加
import { ElMessage } from "element-plus";
import MayCascader from "@/components/cascader/MayCascader.vue";
import { convertToTree } from "@/utils/treeUtils";
import {
  addHouse,
  buildingList,
  HouseTypeList,
  houseupdate,
} from "@/service/config/ConfigApi";
import type { getHouseType, houseaddType } from "@/service/config/ConfigType";

const AvatarUpload = defineAsyncComponent(
  () => import("@/components/upload/AvatarUpload.vue")
);
const upload = import.meta.env.VITE_BASE_URL + "/";
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<houseaddType>({
  id: 0,
  buildingId: 0,
  type: null,
  name: "",
  beds: "",
  picture: null,
});
const options = ref<any>([]);

const rules = reactive<FormRules<houseaddType>>({
  name: [{ required: true, message: "请输入房间号", trigger: "blur" }],
  buildingId: [{ required: true, message: "请选择楼层", trigger: "change" }],
  type: [{ required: true, message: "请选择房间类型", trigger: "change" }],
  beds: [{ required: true, message: "请输入床位数", trigger: "blur" }],
  picture: [{ required: true, message: "请上传房间图片", trigger: "change" }],
});
// 获取楼栋列表
const getbuildingList = async () => {
  let res: any = await buildingList().catch(() => {});
  console.log(33, res);
  if (res?.code === 10000) {
    options.value = convertToTree(res.data.list);
  }
};

// 获取楼栋id
const houseselect = (val: number) => {
  ruleForm.buildingId = val;
};

//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};

//获取房间类型
const paramsroom = reactive<getHouseType>({
  page: 1,
  pageSize: 5,
});
const state = reactive({
  getHouseTypelist: [] as any,
});
//获取房间类型
const getHouseTypelist = async () => {
  const res: any = await HouseTypeList(paramsroom);
  console.log("房间类型", res);
  if (res.code === 10000) {
    state.getHouseTypelist = res.data.list;
  }
};
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid) => {
    if (valid) {
      let res: any;
      if (!ruleForm.id) {
        res = await addHouse(ruleForm);
      } else {
        //修改
        res = await houseupdate(ruleForm);
      }
      if (res.code == 10000) {
        ElMessage.success(res.msg);
        close(true);
      } else {
        ElMessage.error(res.msg);
      }
    }
  });
};

//图片
const emitUpload = ref<string>("");
// 添加营业执照
const uploadimg = (val: any) => {
  console.log("5555", val);
  ruleForm.picture = val;
};

//修改
const props = defineProps(["datail"]);
const amend = () => {
  if (props.datail) {
    Object.assign(ruleForm, props.datail);
    if (props.datail.picture) {
      emitUpload.value = props.datail.picture;
      console.log("图片回显", emitUpload.value);
    }
  }
};

onMounted(() => {
  getHouseTypelist();
  getbuildingList();
  amend();
});
</script>

<style lang="less" scoped>
.el-input {
  width: 230px;
}
</style>
