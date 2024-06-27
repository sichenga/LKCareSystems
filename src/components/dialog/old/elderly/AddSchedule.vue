<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增任务"
    width="20%"
    @close="close"
  >
    {{ ruleForm }}
    {{ schtype }}
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :size="formSize"
      class="demo-ruleForm"
      label-position="left"
      label-width="auto"
      status-icon
      style="max-width: 100%"
    >
      <el-form-item label="服务项目:">
        <el-select
          v-model="ruleForm.serviceId"
          placeholder="请选择服务项目"
          size="large"
          style="width: 240px"
        >
          <el-option
            v-for="item in servelist"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="任务时间：">
        <MayTimeSelect
          :isrange="true"
          :start-placeholder="props.startTime"
          style="width: 200px"
          @change="timechange"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <el-button @click="close(false)">取消</el-button>
      <el-button type="primary" @click="submitForm">确认</el-button>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  defineEmits,
  defineProps,
  inject,
  onMounted,
  reactive,
  ref,
} from "vue";
import type { ComponentSize, FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { useRoute } from "vue-router";
import { elderlyTaskadd } from "@/service/old/elderlytask/ElderlyTaskApi";
import type {
  AddElderlyTaskDto,
  SelectElderlyTaskDto,
} from "@/service/old/elderlytask/ElderlyTaskType";
import MayTimeSelect from "@/components/timepicker/MayTimeSelect.vue";
import { ConfigNursingServiceList } from "@/service/config/ConfigApi";

const route = useRoute();
const props = defineProps({
  editid: {
    type: Number,
    default: 0,
  },
  schdata: {
    type: String,
    default: "",
  },
  startTime: {
    type: String,
    default: "",
  },
});
const servelist = ref<Array<SelectElderlyTaskDto>>([]);
// 接收父组件传递的属性
const schtype = inject<AddElderlyTaskDto>("schtype")!;
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AddElderlyTaskDto>({
  elderlyId: Number(route.query?.id) || 0,
  serviceId: undefined,
  startTime: "",
  endTime: "",
  week: props.schdata,
  day: "",
  type: schtype.type,
});

const dialogVisible = ref(true);

const emit = defineEmits(["close"]);
// 关闭弹框
const close = (close: boolean = false) => {
  emit("close", close);
};

// 服务列表
const getserve = async () => {
  let res: any = await ConfigNursingServiceList();
  if (res?.code === 10000) {
    servelist.value = res.data.list;
  }
};
// 接收父组件提供的函数
const getsch = inject<Function>("getsch")!;
// 提交表单
const submitForm = async () => {
  let res: any = await elderlyTaskadd(ruleForm);
  if (res?.code === 10000) {
    ElMessage.success("添加成功");
    close(true);
    getsch(schtype.typedata);
  }
};
// 获取时间
const timechange = (val: any) => {
  ruleForm.startTime = val[0];
  ruleForm.endTime = val[1];
};

onMounted(() => {
  getserve();
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
.reset {
}
</style>
