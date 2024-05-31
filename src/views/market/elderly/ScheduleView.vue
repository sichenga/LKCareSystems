<template>
  <!-- dialog写在market文件夹下 -->
  {{ form.type }}
  <el-card>
    <div>计划任务</div>
    <el-radio-group v-model="form.type">
      <el-radio
        v-for="item in typedata"
        :key="item"
        :value="item"
        @change="selectdata"
        >{{ item }}</el-radio
      >
    </el-radio-group>
    <div style="margin-top: 30px">
      <MayTable
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :isoperate="false"
        :isShowHeader="form.type !== '日循环' ? true : false"
        :identifier="'schedule'"
      />
    </div>
  </el-card>
</template>

<script lang="ts" setup>
import { reactive, ref, onMounted, provide } from "vue";
import { useRoute } from "vue-router";
import { elderlyTaskgetTask } from "@/service/old/elderlytask/ElderlyTaskApi";
import MayTable from "@/components/table/MayTable.vue";
import times from "@/database/date/time.json";
import month from "@/database/date/month.json";
import week from "@/database/date/week.json";
const route = useRoute();
let schid = route.query?.id;
const typedata = ["日循环", "周循环", "月循环"];
const time = ref<Array<string>>(times);
const date: any = reactive({
  week,
  month,
});

const form: any = reactive({
  type: "日循环",
  typedata: "",
});
const data = reactive({
  tableData: [] as any,
  tableItem: [
    { label: "", prop: "time", width: "100px" },
    { label: "", prop: "task" },
  ] as any,
});
// 处理小时
// const gettime = () => {
//   for (let i = 0; i < 24; i++) {
//     time.value[i] = i > 12 ? `下午${i}时` : `上午${i}时`
//   }
//   console.log(time)
// }
// 处理月
// const getmonth = () => {
//   for (let i = 0; i < 30; i++) {
//     date.month[i] = i + 1 + '号'
//   }
//   console.log(date.month)
// }
// 任务数据
const getlist = async (typedata: any = "") => {
  let res: any = await elderlyTaskgetTask(Number(schid));
  console.log("任务列表", res);
  if (res?.code == 10000) {
    // oldName.tableData = time.value.map((item: any, index: number) => ({
    //   time: item,
    //   task: res.oldName.list.find(
    //     (item1: any) =>
    //       item1.type == form.type && item1.startTime.split(':')[0] == disposetime(String(index))
    //   )
    // }))
    let arr: any = [];
    console.log(4444, form[typedata]);
    console.log(time.value);
    time.value.forEach((item: any, index: number) => {
      let obj: any = {
        time: item,
      };
      if (typedata !== "") {
        console.log("typedata", typedata);
        date[typedata].forEach((item1: any) => {
          obj[item1] = res.data.list.find(
            (item2: any) =>
              item2.type == form.type &&
              item2.startTime.split(":")[0] == disposetime(String(index)) &&
              item2.week == item1
          );
        });
      } else {
        obj.task = res.data.list.find(
          (item1: any) =>
            item1.type == form.type &&
            item1.startTime.split(":")[0] == disposetime(String(index))
        );
      }
      obj.min = disposetime(String(index));
      arr.push(obj);
    });
    data.tableData = arr;
    console.log(data.tableData);
  }
};
// 选择类型
const selectdata = (val: string) => {
  console.log(val);
  // let str = ''
  let obj = { label: "", prop: "time", width: "100px" };
  if (val == "日循环") {
    data.tableItem = [obj, { label: "", prop: "task" }];
    form.typedata = "";
  } else if (val == "周循环") {
    data.tableItem = [
      obj,
      ...date.week.map((item: any) => ({ label: item, prop: item })),
    ];
    form.typedata = "week";
  } else {
    data.tableItem = [
      obj,
      ...date.month.map((item: any) => ({
        label: item,
        prop: item,
        width: "180px",
      })),
    ];
    form.typedata = "month";
  }
  getlist(form.typedata);
};

// 处理时间
const disposetime = (time: string) => {
  return time.length < 2 ? time.padStart(2, "0") : time;
};
// 管理
const Api = () => {
  getlist();
};
onMounted(() => {
  Api();
});
// 传递方法
provide("getsch", getlist);
provide("schtype", form);
</script>

<style lang="less" scoped>
:deep(.el-table) {
  --el-fill-color-light: none;
}

// 设置position 使得 子元素不与其产生新的层叠关系
:deep(.el-table) {
  th.el-table__cell,
  td.el-table__cell {
    position: static;
    padding: 0;
  }
}
:deep(.el-table) {
  .cell {
    position: relative;
    height: 60px;
    width: 100%;
    overflow: visible;
  }
}
</style>
