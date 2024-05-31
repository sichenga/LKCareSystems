<template>
  <el-dialog
    v-model="dialogVisible"
    title="缴费结算"
    width="800"
    @close="close"
  >
    <div class="box">
      <div class="img">
        <div class="demo-image">
          <div v-for="fit in fits" :key="fit" class="block">
            <el-image style="width: 60px; height: 60px" :src="url" fit="fill" />
          </div>
        </div>
      </div>
      <div class="l">
        <div>老人姓名：</div>
        <div>身份证/护照号：</div>
        <div>床位号：</div>
        <div>入住时间：</div>
      </div>
      <div class="r">
        <div>张三</div>
        <div>3293819982929212</div>
        <div>504/01</div>
        <div>2020-03-03 至 2020-05-05</div>
      </div>
    </div>
    <div class="from">
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
        <el-form-item label="核定时间段:" prop="name">
          2020-03-03 至 2020-04-05
        </el-form-item>
        <el-form-item label="核定天数:" prop="name"> 30天 </el-form-item>
        <el-form-item label="费用明细:" prop="name">
          <MayTable
            :tableData="data.tableData"
            :tableItem="data.tableItem"
            :isoperate="false"
          />
        </el-form-item>
        <el-form-item label=" 核定缴费金额:" prop="name">
          25000.00
        </el-form-item>
        <el-form-item label="  收款人:" prop="name"> 张三 </el-form-item>
        <el-form-item label=" 收款日期:" prop="name">
          2020-03-03 16：00
        </el-form-item>
      </el-form>
    </div>
    <div class="btn">
      <el-button>关闭</el-button>
    </div>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">取消</el-button>
        <el-button type="primary" @click="close(true)"> 确认收款 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits,
  onMounted,
  defineAsyncComponent,
} from "vue";
import type { ImageProps } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
import AdmissionDialog from "@/database/AdmissionDialog.json";
const fits = ["fill"] as ImageProps["fit"][];
const url =
  "https://fuss10.elemecdn.com/e/5d/4a731a90594a4af544c0c25941171jpeg.jpeg";

interface RuleForm {
  name: string;
}
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  name: "Hello",
});

const rules = reactive<FormRules<RuleForm>>({
  name: [
    { required: true, message: "Please input Activity name", trigger: "blur" },
    { min: 3, max: 5, message: "Length should be 3 to 5", trigger: "blur" },
  ],
});

// const submitForm = async (formEl: FormInstance | undefined) => {
//   if (!formEl) return
//   await formEl.validate((valid, fields) => {
//     if (valid) {
//       console.log('submit!')
//     } else {
//       console.log('error submit!', fields)
//     }
//   })
// }
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "project",
      label: "项目名称",
    },
    {
      prop: "subtotal",
      label: "小计（元）",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AdmissionDialog;
  }, 1000);
};
onMounted(() => {
  getlist();
});

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

.box {
  height: 180px;
  display: flex;
  border-bottom: 1px solid #ededed;
  margin-bottom: 10px;

  .img {
    width: 130px;
  }

  .l {
    width: 180px;
    line-height: 40px;
  }

  .r {
    line-height: 40px;
  }
}

.from {
  border-bottom: 1px solid #ededed;
}
.btn {
  text-align: center;
  margin-top: 10px;
}
</style>
