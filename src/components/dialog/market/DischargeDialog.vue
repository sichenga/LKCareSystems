<template>
  <!--新增出院申请  -->
  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id == 0 ? '新增出院申请' : '编辑出院申请'"
    width="500"
    @close="close"
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
      <el-form-item label="老人：">
        <div v-if="oldName" @click="select">{{ oldName }}</div>
        <div v-else>
          <el-button type="primary" @click="select" style="margin-right: 30px"
            >请选择</el-button
          >
        </div>
      </el-form-item>
      <el-form-item label="出院原因：" prop="reason">
        <el-input v-model="ruleForm.reason" type="textarea" />
      </el-form-item>
      <el-form-item label="预计时间：" prop="expectDate">
        <MayTimePicker
          :format="'YYYY-MM-DD'"
          :valueFormat="'YYYY-MM-DD'"
          @change="handlchange"
          :remtime="time"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定</el-button
        >
      </div>
    </template>
  </el-dialog>
  <!-- 老人 -->
  <OldSelectDialog v-if="olddialog" @id="getid" @close="closes" />
</template>
<script lang="ts" setup>
import { ref, reactive, defineEmits, onMounted, defineProps } from "vue";
import MayTimePicker from "@/components/timepicker/MayTimePicker.vue";
import { getElderly } from "@/service/old/OldApi";
import {
  dischargeAdd,
  dischargeGet,
  dischargeUpdate,
} from "@/service/market/DischargeApi";
import { ElMessage } from "element-plus";
import type { dischargeAddParams } from "@/service/market/DischargeType";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import OldSelectDialog from "@/components/dialog/OldSelect/OldSelectDialog.vue";
const formSize = ref<ComponentSize>("default");
const props = defineProps(["id"]);
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<dischargeAddParams>({
  id: 0,
  elderlyId: undefined,
  expectDate: "",
  reason: "",
});
const rules = reactive<FormRules<dischargeAddParams>>({
  expectDate: [{ required: true, message: "请选择时间", trigger: "blur" }],
  reason: [{ required: true, message: "请输入出院原因", trigger: "change" }],
});
// 确定
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (ruleForm.elderlyId == null) {
        ElMessage.error("请选择老人");
      } else {
        let res: any;
        if (ruleForm.id == 0) {
          res = await dischargeAdd(ruleForm);
        } else {
          res = await dischargeUpdate(ruleForm);
        }
        console.log(res);
        if (res.code == 10000) {
          close(true);
          ElMessage.success(ruleForm.id == 0 ? "新增成功" : "修改成功");
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

const olddialog = ref(false);
// 选择
const select = () => {
  olddialog.value = true;
};

// 选择老人
const oldName = ref<string>("");
const getid = async (id: number) => {
  ElMessage.success("选择成功");

  console.log(4444, id);
  let res: any = await getElderly(id);
  console.log(2222, res);
  if (res?.code == 10000) {
    oldName.value = res.data.name;
    ruleForm.elderlyId = res.data.id;
  }
  // ruleForm.elderlyId = oldName.value.id
};

// 回显数据
const time = ref("");
const getData = async () => {
  if (props.id) {
    const res: any = await dischargeGet(props.id);
    console.log("单条数据", res);
    if (res.code == 10000) {
      Object.assign(ruleForm, res.data);
      time.value = ruleForm.expectDate;
      listold(ruleForm.elderlyId);
    }
    console.log(ruleForm);
  }
};
const listold = async (id: any) => {
  const res: any = await getElderly(id);
  console.log("单条老人", res);
  if (res.code == 10000) {
    oldName.value = res.data.name;
  }
};

onMounted(() => {
  getData();
});

// 关闭弹出
const closes = () => {
  olddialog.value = false;
};
// 预计时间
const handlchange = (val: any) => {
  ruleForm.expectDate = val;
};
// 弹窗
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
