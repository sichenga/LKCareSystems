<template>
  <!-- 新增用药登记 -->
  <div class="app-container">
    <el-card>
      <AddRegInfoDialog
        v-if="isdialog"
        @close="close"
        :remdata="remdata"
        @regdata="regdata"
      />
      <el-form
        :model="formInline"
        class="demo-form-inline"
        :rules="rules"
        ref="ruleFormRef"
      >
        <el-form-item label="登记日期：" prop="addTime">
          <TimePicker
            @click="selectTime"
            :remtime="date"
            :valueFormat="format"
            :format="format"
          />
        </el-form-item>

        <el-form-item label="家属姓名：" prop="familyName">
          <el-input
            v-model="formInline.familyName"
            placeholder="请输入"
            clearable
          />
        </el-form-item>
      </el-form>
      <div style="margin: 20px 0">
        <div>药品：</div>
        <el-button type="primary" @click="add">新增</el-button>
      </div>
      <!-- 表格 -->
      <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
        <template #operate="{ data, index }">
          <el-button type="primary" text @click="edit(data)">编辑</el-button>
          <el-button type="primary" text @click="del(index)">删除</el-button>
        </template>
      </MayTable>
      <div class="button">
        <el-button type="primary" @click="submitForm(ruleFormRef)"
          >保存</el-button
        >
        <el-button @click="getback">取消</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, defineAsyncComponent, provide } from "vue";
import { getMessageBox } from "@/utils/utils";
import { ElMessage } from "element-plus";
import type { FormRules, FormInstance } from "element-plus";
import { DrugsAdd } from "@/service/medicalcare/MedicalcareApi";
import type { DrugsAddParams } from "@/service/medicalcare/MedicalcareType";
import { useRoute, useRouter } from "vue-router";
const route = useRoute();
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const TimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const AddRegInfoDialog = defineAsyncComponent(
  () => import("@/components/dialog/medicalcare/AddRegInfoDialog.vue")
);
import moment from "moment";
const date = moment(new Date()).format("YYYY-MM-DD");
const format = "YYYY-MM-DD";
const ruleFormRef = ref<FormInstance>();
const formInline = reactive<DrugsAddParams>({
  id: null,
  elderlyId: Number(route.query?.oldId),
  addTime: date,
  familyName: "",
});
const rules = reactive<FormRules<DrugsAddParams>>({
  addTime: [
    {
      required: true,
      message: "请选择输入日期",
      trigger: "change",
    },
  ],
  familyName: [
    {
      required: true,
      message: "请输入姓名",
      trigger: "blur",
    },
  ],
});
const isdialog = ref(false);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "药品名称",
    },
    {
      prop: "counts",
      label: "数量",
    },
    {
      prop: "expTime",
      label: "有效期",
    },
    {
      prop: "sum",
      label: "剂量",
    },
    {
      prop: "remarks",
      label: "服法",
    },
  ],
});

// 选择时间
const selectTime = (val: string) => {
  formInline.addTime = val;
};
// 关闭弹窗
const close = () => {
  if (remdata.value) {
    remdata.value = {};
  }
  isdialog.value = false;
};

// 开启弹窗
const add = () => {
  isdialog.value = true;
};
// 编辑
const remdata = ref({});
const edit = (data: any) => {
  remdata.value = data;
  isdialog.value = true;
};

// 删除
const del = async (index: number) => {
  let res = await getMessageBox("是否确认删除该条记录", "删除后将不可恢复");
  console.log(11112, res);
  if (res) {
    data.tableData.splice(index, 1);
    ElMessage.success("删除成功");
  } else {
    ElMessage.info("取消删除");
  }
};
// 返回
const getback = () => {
  router.push("/medicalcare/medicinelogs");
};
// 添加数据
const regdata = (val: any) => {
  if (!val?.id) {
    val.id = data.tableData.length + 1;
    data.tableData.push(val);
  } else {
    data.tableData.splice(val.id - 1, 1, val);
  }
};
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate().catch(() => {});
  if (valid) {
    await data.tableData.forEach(async (item: any) => {
      let res = await DrugsAdd({
        ...formInline,
        ...item,
      });
      console.log("添加", res);
    });
    router.push("/medicalcare/medicinelogs");
    ElMessage.success("添加成功");
  }
};
// 向后代提供数据
provide("tableData", data.tableData);
</script>
<style lang="less" scoped>
.el-input {
  width: 220px;
  height: 40px;
}
.el-button {
  height: 40px;
  line-height: 40px;
}
.button {
  width: 100%;
  margin-top: 60px;
  display: flex;
  justify-content: center;
}
</style>
