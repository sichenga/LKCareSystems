<template>
  <div class="app-container">
    <el-card style="max-width: 100%">
    <!-- 护理项目  /  配置服务 -->
    <el-form :model="form" label-width="auto" style="max-width: 600px">
      <el-form-item label="项目名称:">
        <el-input v-model="form.name" placeholder="晨起" />
      </el-form-item>
      <el-form-item label="项目描述:">
        <el-input v-model="form.name" placeholder="辅助老人晨起" />
      </el-form-item>
      <el-form-item label="配置服务:">
        <el-input v-model="form.desc" type="textarea" />
      </el-form-item>
    </el-form>
    <div class="gradebox">
      <div class="grade">护理等级：<span>轻度</span></div>
      <div class="btn">
        <el-button type="primary" @click="isdialog = true">新增</el-button>
        <ProjectDialog @close="close" v-if="isdialog" />
      </div>
      <div class="grid">
        <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
          <template #operate>
            <el-button type="primary" text>移除</el-button>
          </template>
        </MayTable>
      </div>
    </div>
    <div class="gradebox">
      <div class="grade">护理等级：<span>中度</span></div>
      <div class="btn">
        <el-button type="primary" @click="isdialog = true">新增</el-button>
        <ProjectDialog @close="close" v-if="isdialog" />
      </div>
      <div class="grid">
        <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
          <template #operate>
            <el-button type="primary" text>移除</el-button>
          </template>
        </MayTable>
      </div>
    </div>
    <div class="gradebox">
      <div class="grade">护理等级：<span>重度</span></div>
      <div class="btn">
        <el-button type="primary" @click="isdialog = true">新增</el-button>
        <!-- <IndustryDialog @close="close" v-if="isdialog"></IndustryDialog> -->
      </div>
      <div class="grid">
        <MayTable :tableData="data.tableData" :tableItem="data.tableItem">
          <template #operate>
            <el-button type="primary" text>移除</el-button>
          </template>
        </MayTable>
      </div>
    </div>
    <div class="btns">
      <el-form-item>
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="save">保存</el-button>
      </el-form-item>
    </div>
  </el-card>
  </div>
  
</template>

<script lang="ts" setup>
import { ref, onMounted, reactive, defineAsyncComponent } from "vue";
import IndustryView from "@/database/IndustryView.json";

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
// const ProjectDialog = defineAsyncComponent(() => import('@/components/dialog/ProjectDialog.vue'))
import { useRouter } from "vue-router";
import ProjectDialog from "@/components/dialog/config/ProjectDialog.vue";
const router = useRouter();
// do not use same name with ref
const form = reactive({
  name: "",
  desc: "",
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
    data.tableData = IndustryView;
  }, 1000);
};
onMounted(() => {
  getlist();
});
//弹出框
const isdialog = ref(false);
const close = () => {
  isdialog.value = false;
};
//跳转页面
const cancel = () => {
  router.push({
    path: "Project",
  });
};
const save = () => {
  router.push({
    path: "Project",
  });
};
</script>

<style lang="less" scoped>
.gradebox {
  margin-top: 20px;
  .grade {
    height: 30px;
    line-height: 30px;
    font-size: 14px;
  }

  .btn {
    height: 50px;
    .el-button {
      width: 100px;
      margin-top: 10px;
    }
  }

  .grid {
    margin-top: 10px;
  }
}
.btns {
  width: 200px;
  height: 100px;
  margin: 50px auto 0;
}
</style>
