<template>
  <!-- dialog写在market文件夹下 -->
  <div class="app-container">
    <el-card style="margin-top: 15px" class="section">
    <div class="title">
      <div class="title-box">
        <div class="title-text">
          <span>▋</span>
          老人信息
        </div>
        <div class="status-size">未签约</div>
      </div>
    </div>
    <div class="form-size">
      <div class="form-item">
        <div>老人姓名：</div>
        <div class="name">张三</div>
      </div>
      <div class="form-item">
        <div>老人性别：</div>
        <div class="name">男</div>
      </div>
      <div class="form-item">
        <div>身份证号：</div>
        <div class="name">23802304203</div>
      </div>
      <div class="form-item">
        <div>老人状况：</div>
        <div class="name">身体健康！</div>
      </div>
    </div>
    <div class="title-text">
      <span>▋</span>
      家属信息
    </div>
    <div class="form-size">
      <!-- 表格 -->
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :isoperate="isoperate"
      />
    </div>
    <div class="title-text">
      <span>▋</span>
      需求总结
    </div>
    <div class="form-size">
      <div class="form-item">
        <div class="home">房间需求</div>
        <div>无要求</div>
      </div>
      <div class="form-item">
        <div class="home">意向需求</div>
        <div>无要求</div>
      </div>
    </div>
  </el-card>
  <div class="title-btn">
    <el-button>取消</el-button>
  </div>
  </div>
  
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import AffiliatedView from "@/database/AffiliatedView.json";

const isoperate = ref(false);
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "姓名",
    },
    {
      prop: "address",
      label: "性别",
    },
    {
      prop: "manager",
      label: "身份证号码",
    },
    {
      prop: "phone",
      label: "联系电话",
    },
    {
      prop: "username",
      label: "联系地址",
    },
    {
      prop: "userpass",
      label: "与老人关系",
    },
  ],
});
const getlist = () => {
  setTimeout(() => {
    data.tableData = AffiliatedView;
  }, 1000);
};

onMounted(() => {
  getlist();
});
</script>
<style lang="less" scoped>
.section {
  width: 100%;
  background-color: #fff;
}

.title-text {
  margin: 40px;

  span {
    color: #409eff;
  }
}

.form-size {
  margin: 40px;
}

.title {
  display: flex;
  justify-content: space-between;
  height: 57px;
  .title-box {
    display: flex;
    align-items: center;
    .status-size {
      font-size: 30px;
      margin-left: 1300px;
    }
  }
}

.form-size-box {
  margin-bottom: 120px;
}

.title-btn {
  margin: 40px 690px;

  .el-button {
    width: 100px;
    height: 40px;
  }
}

.el-form-item {
  width: 429px;
  margin-top: 40px;
  margin-left: 40px;
}
.form-item {
  display: flex;
  div {
    margin-bottom: 10px;
  }
  .name {
    margin-left: 30px;
  }
  .home {
    margin-right: 100px;
  }
}

.button {
  width: 92px;
  height: 40px;
}
</style>
