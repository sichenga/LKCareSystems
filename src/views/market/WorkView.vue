<template>
  <div>
    <!-- dialog写在market文件夹下 -->
    <el-card>
      <div class="body-top">
        <div>
          <el-image
            style="width: 50px; height: 50px; margin-top: 11px"
            :src="oldinfo?.photo ? upload + oldinfo?.photo : ''"
            fit="cover"
          />
        </div>
        <div class="size-I-right">
          <div class="size-right">
            <div>老人姓名:</div>
            <div>{{ oldinfo?.name }}</div>
          </div>
          <div class="size-right">
            <div>身份证/护照号:</div>
            <div>{{ oldinfo?.idCard }}</div>
          </div>
          <div class="size-right">
            <div>床位号:</div>
            <div>{{ oldinfo?.begName }}</div>
          </div>
        </div>
      </div>
    </el-card>

    <el-card style="margin-top: 15px">
      <div class="title">排班管理</div>
      <MayTable
        :isoperate="false"
        :table-data="data.tableData"
        :table-item="data.tableItem"
        :identifier="'word'"
        @close="close"
      />
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, provide } from "vue";
import { useRoute } from "vue-router";
import MayTable from "@/components/table/MayTable.vue";
import { getScheduleList } from "@/service/old/schedule/ScheduleApi";
import { getElderly } from "@/service/old/OldApi";
import type { ElderlyInfo } from "@/service/old/schedule/ScheduleType";

const upload = import.meta.env.VITE_BASE_URL + "/";
const route = useRoute();
const oldid = ref(route.query?.id);
// 老人信息
const oldinfo = ref<ElderlyInfo>();
const weekdata = ["周一", "周二", "周三", "周四", "周五", "周六", "周日"];
const weektype = ["白班", "晚班"];
const data = reactive({
  tableData: [] as any,
  tableItem: [] as any,
});
// 排班列表
const getlist = async () => {
  let res: any = await getScheduleList(Number(oldid.value));
  let workarr: any = [];
  console.log("排班管理", res);
  if (res?.code === 10000) {
    data.tableItem = [
      {
        label: "",
        prop: "type",
      },
      ...weekdata.map((item: any) => ({ label: item, prop: item })),
    ];
    weektype.forEach((item: any) => {
      let obj: any = {
        type: item,
      };
      res.data.list.forEach((chitem: any, index: number) => {
        if (chitem.day == item) {
          console.log(33333, chitem);
          obj[chitem.week] = [...(obj[chitem.week] || ""), chitem];
        }
      });
      console.log(1111, obj);

      workarr.push(obj);
    });
    data.tableData = workarr;

    console.log(data.tableItem);
    console.log(data.tableData);
  }
};
// 获取老人信息
const getOldInfo = async () => {
  let res: any = await getElderly(Number(oldid.value));
  console.log("老人信息", res);
  if (res?.code === 10000) {
    oldinfo.value = res.data;
  }
};
// 刷新列表
const close = () => {
  getlist();
};
onMounted(() => {
  getOldInfo();
  getlist();
});
provide("getwork", getlist);
</script>
<style lang="less" scoped>
.el-input {
  height: 40px;
}

.el-button {
  height: 40px;
  line-height: 40px;
}

.el-form--inline .el-form-item {
  width: 270px;
}

.body-top {
  display: flex;

  .size-I-right {
    margin-left: 55px;

    .size-right {
      display: flex;

      div {
        margin: 7px 0;
      }

      div:nth-child(1) {
        width: 160px;
      }
    }
  }
}
.title {
  margin: 15px 0;
}
</style>
