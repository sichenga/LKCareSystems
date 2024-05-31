<template>
  <!-- 详情资讯 -->
  <el-dialog v-model="dialogVisibles" title="详情" width="500" @close="close">
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      label-width="auto"
      class="demo-ruleForm"
      size
      status-icon
    >
      <el-form-item label="咨询类型:" prop="name">
        <div>
          {{ ruleForm.type }}
        </div>
      </el-form-item>
      <el-form-item label="咨询渠道:" prop="name">
        <div>
          {{ ruleForm.source }}
        </div>
      </el-form-item>
      <el-form-item label="咨询人:" prop="name">
        <div>
          {{ ruleForm.name }}
        </div>
      </el-form-item>
      <el-form-item label="联系电话：" prop="name">
        <div>
          {{ ruleForm.mobile }}
        </div>
      </el-form-item>
      <el-form-item label="与老人关系:" prop="name">
        <div>
          {{ ruleForm.relation }}
        </div>
      </el-form-item>
      <el-form-item label="策划回访日期:" prop="name">
        <div>
          {{ mons(ruleForm.visitTime).format("YYYY-MM-DD HH:mm") }}
        </div>
      </el-form-item>
      <el-form-item label="咨询内容:">
        <div>
          {{ ruleForm.content }}
        </div>
      </el-form-item>
      <el-form-item label="登记人:">
        <div>
          {{ ruleForm.addAccountName }}
        </div>
      </el-form-item>
      <el-form-item label="登记时间:">
        <div>
          {{ mons(ruleForm.addTime).format("YYYY-MM-DD HH:mm") }}
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="close"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineEmits, defineProps } from "vue";
import type { FormInstance } from "element-plus";
import { getquestionlist } from "@/service/market/marketApi";
import moment from "moment";
const mons = moment;
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<any>({});

const dialogVisibles = ref(true);
const props = defineProps({
  editId: {
    type: Number,
    default: 0,
  },
});
const emit = defineEmits(["close"]);

const close = (close: boolean = false) => {
  emit("close", close);
};

// 查询单挑咨询
const Questionlist = async () => {
  if (props.editId) {
    let res: any = await getquestionlist(props.editId);
    console.log(res);

    if (res?.code == 10000) {
      Object.assign(ruleForm, res.data);
    }
  }
};
onMounted(() => {
  Questionlist(); //获取单挑咨询   详情
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
.el-form-item {
  div {
    margin-left: 58px;
  }
}
</style>
