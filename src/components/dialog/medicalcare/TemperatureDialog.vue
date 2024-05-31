<template>
  <el-dialog
    v-model="dialogVisible"
    :title="props.data.id ? '修改' : '添加'"
    width="500"
    @close="close"
  >
    <el-form
      ref="ruleFormRef"
      style="max-width: 368px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      size
      status-icon
    >
      <el-form-item
        label="请选择测量体温的老人"
        prop="elderlyId"
        class="Special_line"
      >
        <div v-if="OldName" @click="select">
          {{ OldName }}
        </div>
        <el-button v-else type="primary" @click="select">选择老人</el-button>
        <OldSelectDialog v-if="idOld" @id="oldid" @close="oldclose" />
      </el-form-item>
      <el-form-item label="老人体温" prop="val">
        <el-input v-model="ruleForm.val" />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="confirm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineEmits, defineProps } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { getElderly } from "@/service/old/OldApi";
import {
  TemperatureAdd,
  TemperatureUpdate,
} from "@/service/medicalcare/MedicalcareApi";
import { ElMessage } from "element-plus";
import OldSelectDialog from "@/components/dialog/OldSelect/OldSelectDialog.vue";

const ruleFormRef = ref<FormInstance>();
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});

const ruleForm = reactive<any>({
  elderlyId: null,
  val: "",
});
const rules = reactive<FormRules<any>>({
  elderlyId: [
    {
      required: true,
      message: "请选择老人",
      trigger: "change",
    },
  ],
});
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
// 选择老人
const idOld = ref(false);
const select = () => {
  idOld.value = true;
};
const OldName = ref("");
const oldid = async (id: number) => {
  console.log(id);
  if (id) {
    let res: any = await getElderly(id);
    if (res?.code == 10000) {
      idOld.value = false;
      OldName.value = res.data.name;
    }
    ruleForm.elderlyId = id;
    ElMessage.success("选择老人成功");
  }
};
const oldclose = () => {
  idOld.value = false;
};

// 数据回显
const Editold = async () => {
  if (props.data) {
    OldName.value = props.data.elderlyName;
    Object.assign(ruleForm, props.data);
  }
};
//确定
const confirm = async () => {
  let res: any;
  if (props.data.id) {
    res = await TemperatureUpdate(ruleForm);
  } else {
    res = await TemperatureAdd(ruleForm);
  }
  if (res?.code == 10000) {
    ElMessage.success(props.data.id ? "修改成功" : "添加成功");
    close(true);
  }
};
onMounted(async () => {
  await Editold(); //单挑体温
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}

.Special_line {
  :deep(.el-form-item__content) {
    justify-content: space-between;

    .el-input {
      width: 140px;
    }

    .el-select {
      width: 140px;
    }
  }
}
</style>
