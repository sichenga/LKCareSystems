<template>
  <!-- 配置护理方案 -->
  <el-card style="max-width: 100%">
    <div class="header">护理等级:<span>重度护理</span></div>
    <div class="title">▋<span>护理服务</span></div>
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
      <el-form-item label="护理项目" prop="type">
        <el-checkbox-group v-model="ruleForm.type">
          <el-checkbox value="Online activities" name="type">
            娱乐
          </el-checkbox>
          <el-checkbox value="Promotion activities" name="type">
            晨起
          </el-checkbox>
          <el-checkbox value="Offline activities" name="type">
            就寝
          </el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
    <div class="servebox">
      <div class="serve"><span>*</span> 服务配置:</div>
      <div class="morning">
        <div class="running">晨起</div>
        <div class="table">
          <MayTable
            :tableData="data.tableData"
            :tableItem="data.tableItem"
            :isoperate="false"
            style="width: 800px"
          />
        </div>
      </div>
      <div class="morning">
        <div class="running">娱乐</div>
        <div class="table">
          <MayTable
            :tableData="data.tableData"
            :tableItem="data.tableItem"
            :isoperate="false"
            style="width: 800px"
          />
        </div>
      </div>
    </div>
    <el-form-item class="btn">
      <el-button @click="cancel">取消</el-button>
      <el-button type="primary" @click="confirm">确定</el-button>
    </el-form-item>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, defineAsyncComponent, onMounted } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import ConfigurationView from "@/database/ConfigurationView.json";
import { useRouter } from "vue-router";
const router = useRouter();
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
interface RuleForm {
  type: string[];
}

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<RuleForm>({
  type: [],
});

const rules = reactive<FormRules<RuleForm>>({
  type: [
    {
      type: "array",
      required: true,
      message: "请选择护理项目",
      trigger: "change",
    },
  ],
});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "serve",
      label: "护理服务",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = ConfigurationView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
//跳转页面
const cancel = () => {
  router.push({
    path: "Addedlevel",
  });
};
const confirm = () => {
  router.push({
    path: "Addedlevel",
  });
};
</script>

<style lang="less" scoped>
.header {
  height: 50px;
  line-height: 50px;
  font-size: 15px;
}

.title {
  height: 80px;
  line-height: 80px;
  font-size: 15px;
  color: #529bfd;

  span {
    color: black;
    font-weight: bold;
  }
}

.servebox {
  height: 100%;

  .serve {
    height: 50px;
    line-height: 50px;

    span {
      color: red;
    }
  }

  .morning {
    height: 100%;

    .running {
      height: 80px;
      line-height: 80px;
    }
  }
}

.btn {
  height: 50px;
  width: 200px;
  margin: 100px auto 0;
}
</style>
