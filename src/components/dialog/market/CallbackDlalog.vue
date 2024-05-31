<template>
  <el-dialog
    v-model="dialogVisible"
    :title="params.datas ? '编辑回访记录' : '新增回访记录'"
    width="500"
    @close="close(false)"
  >
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
      <el-form-item label="回访内容:" prop="content">
        <el-input v-model="ruleForm.content" placeholder="请输入回访内容" />
      </el-form-item>
      <el-form-item label="计划回访时间:" prop="callbackTime">
        <MayTimePicker @change="handChange" :remtime="ruleForm.callbackTime" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="addition"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, defineEmits, onMounted, defineProps } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import type { AddFollowup } from "@/service/market/marketType";
import { followupAdd, followupupdate } from "@/service/market/marketApi";
import MayTimePicker from "@/components/timepicker/MayTimePicker.vue";
import { useRoute } from "vue-router";
const route = useRoute();

const params = defineProps(["datas"]);

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AddFollowup>({
  questionId: Number(route.query.id),
  callbackTime: "",
  content: "",
});

const handChange = (val: any) => {
  ruleForm.callbackTime = val;
};

const rules = reactive<FormRules<AddFollowup>>({
  content: [{ required: true, message: "请输入回访内容", trigger: "blur" }],
  callbackTime: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
});

//添加
const addition = async () => {
  let res: any;
  if (params.datas) {
    res = await followupupdate(ruleForm).catch(() => {});
  } else {
    res = await followupAdd(ruleForm).catch(() => {});
  }
  if (res?.code == 10000) {
    close(true);
    ElMessage.success(params.datas ? "修改成功" : "添加成功");
  }
};

const dialogVisible = ref(true);

const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
//修改数据回显
const datalist = () => {
  //修改数据回显
  if (params.datas) {
    Object.assign(ruleForm, params.datas);
    ruleForm.callbackTime = params.datas.timestamp;
  }
};

onMounted(() => {
  datalist(); //修改数据回显
});
</script>
<style lang="less" scoped></style>
