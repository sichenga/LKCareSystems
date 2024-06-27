<template>
  <el-dialog
    v-model="dialogVisible"
    :title="params.id ? '修改楼层' : '新增楼层'"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :size="formSize"
      class="demo-ruleForm"
      label-width="auto"
      status-icon
      style="max-width: 400px"
    >
      <el-form-item label="楼层号" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入楼层号" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="add">确定</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { defineProps, onMounted, reactive, ref } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import { BuildingAdd, Buildingupdate } from "@/service/config/ConfigApi";
import type { RuleForm } from "@/service/config/ConfigType";

const params = defineProps({
  pid: {
    type: Number,
    default: 0,
  },
  id: {
    type: Number,
    default: 0,
  },
  list: {
    type: Object,
    default: () => {
      return {};
    },
  },
});

const rules = reactive<FormRules<RuleForm>>({
  name: [
    {
      required: true,
      message: "请输入楼层",
      trigger: "blur",
    },
  ],
});
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  id: params.id,
  name: "",
  pid: params.pid, //楼栋父ID
});

// 添加
const add = async () => {
  let res: any;
  if (params.id) {
    res = await Buildingupdate(ruleForm).catch(() => {});
  } else {
    res = await BuildingAdd(ruleForm).catch(() => {});
  }
  if (res.code == 10000) {
    ElMessage.success(res.data.id == 0 ? "添加成功" : "修改成功");
    emit("close", true);
  }
};

//弹框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
// 回显数据
const getData = () => {
  if (params.list) {
    Object.assign(ruleForm, params.list);
  }
};

onMounted(() => {
  getData();
});
</script>

<style lang="less" scoped></style>
