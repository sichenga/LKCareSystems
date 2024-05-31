<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.ids ? '编辑咨询登记' : '新增咨询登记'"
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
      <el-form-item label="咨询类型:" prop="type">
        <el-select
          v-model="ruleForm.type"
          placeholder="请选择"
          style="width: 300px"
        >
          <el-option label="线上咨询" value="线上咨询" />
          <el-option label="线下咨询" value="线下咨询" />
        </el-select>
      </el-form-item>
      <el-form-item label="咨询渠道:" prop="source">
        <el-radio-group v-model="ruleForm.source">
          <el-radio value="来访登记">来访登记</el-radio>
          <el-radio value="电话">电话</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="咨询人:" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入咨询人" />
      </el-form-item>
      <el-form-item label="联系电话：" prop="mobile">
        <el-input v-model="ruleForm.mobile" placeholder="请输入联系电话" />
      </el-form-item>
      <el-form-item label="与老人关系:" prop="relation">
        <el-select
          v-model="ruleForm.relation"
          placeholder="请选择"
          style="width: 300px"
        >
          <el-option
            v-for="item in addresslist"
            :key="item.id"
            :label="item.lable"
            :value="item.lable"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="策划回访日期:" prop="visitTime">
        <MayTimePicker @change="handlchange" :remtime="time" />
      </el-form-item>
      <el-form-item label="咨询内容:">
        <el-input
          v-model="ruleForm.content"
          type="textarea"
          placeholder="请输入咨询内容"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineEmits, defineProps } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import MayTimePicker from "@/components/timepicker/MayTimePicker.vue";
import {
  questionAdd,
  getquestionlist,
  questionUpdate,
} from "@/service/market/marketApi";
import type { Addmarket } from "@/service/market/marketType";
import { ElMessage } from "element-plus";
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
//编辑id
const props = defineProps(["ids", "customerId"]);

const time = ref("");
//添加咨询
const ruleForm = reactive<Addmarket>({
  //潜在客户老人id
  customerId: props.customerId,
  type: "",
  source: "",
  name: "",
  mobile: "",
  relation: "",
  visitTime: "",
  content: "",
});

const rules = reactive<FormRules<any>>({
  name: [{ required: true, message: "请输入资讯人", trigger: "blur" }],
  mobile: [{ required: true, message: "请输入联系方式", trigger: "blur" }],
  type: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
  source: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
  relation: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
  visitTime: [
    {
      required: true,
      message: "请选择",
      trigger: "change",
    },
  ],
});
//是否弹窗
const dialogVisible = ref(true);
//与老人关系
const addresslist = ref([
  { lable: "父子关系", id: 1 },
  { lable: "父女关系", id: 2 },
  { lable: "母子关系", id: 3 },
  { lable: "母女关系", id: 4 },
  { lable: "其他", id: 5 },
]);
//选择时间
const handlchange = (val: any) => {
  ruleForm.visitTime = val;
};
//子传父
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};

// 查询单挑咨询
const Questionlist = async () => {
  if (props.ids) {
    let res: any = await getquestionlist(props.ids);
    if (res?.code == 10000) {
      Object.assign(ruleForm, res.data);
      time.value = ruleForm.visitTime;
    }
  }
};

//确定添加/修改
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      let res: any;
      if (props.ids) {
        res = await questionUpdate(ruleForm).catch(() => {});
      } else {
        res = await questionAdd(ruleForm).catch(() => {});
      }
      if (res?.code === 10000) {
        close(true);
        ElMessage.success(props.ids ? "修改成功" : "添加成功");
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};
onMounted(() => {
  Questionlist(); //获取单挑咨询
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
