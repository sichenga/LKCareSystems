<template>
  <!-- 排班管理 -->
  <AddWork v-if="iswodk" :worddata="worddata" @close="close" />
  <!-- 任务管理 -->
  <AddSchedule
    v-if="isschedule"
    :schdata="Scheduledata"
    :startTime="startTime"
    @close="close"
  />
  <el-table
    v-loading="appStore.isLoading"
    :data="props.tableData"
    :header-cell-style="{
      background: '#f9f9f9',
      color: '#000000',
      height: '50px',
    }"
    :row-style="cellstyle as any"
    :show-header="props.isShowHeader"
    border
    @selection-change="handleSelectionChange"
  >
    <el-table-column v-if="isMultiple" type="selection" width="55" />
    <el-table-column
      v-for="(item, index) in props.tableItem"
      :key="index"
      :label="item.label"
      :prop="item.prop"
      :width="item.width"
    >
      <template
        v-if="
          item.prop == 'photo' ||
          item.prop == 'qrcode' ||
          item.prop == 'elderlyPhoto'
        "
        #default="{ row }"
      >
        <el-image
          v-if="row.photo || row.qrcode || row.elderlyPhoto"
          :src="upload + (row.photo || row.qrcode || row.elderlyPhoto)"
          style="width: 50px; height: 50px"
        />
      </template>

      <!-- 所属岗位      角色数据 -->
      <template v-else-if="item.prop == 'roles'" #default="{ row }">
        <span v-if="row.roles.length > 0">
          {{ row.roles.map((item: any) => item?.name).toString() }}</span
        >
      </template>

      <template
        v-else-if="props.identifier == 'administration' && item.prop == 'image'"
        #default="{ row }"
      >
        <el-image
          :src="upload + row.image"
          fit="cover"
          style="width: 50px; height: 50px"
        />
      </template>
      <!-- 入院管理 -->
      <template
        v-else-if="
          props.identifier == 'Hospitalized' && item.prop === 'elderlyPhoto'
        "
        #default="{ row }"
      >
        <el-image
          :src="upload + row.elderlyPhoto"
          fit="cover"
          style="width: 50px; height: 50px"
        />
      </template>

      <!-- 出入院管理>老人管理>新增>健康信息 -->
      <template
        v-else-if="props.identifier == 'oldphysical' && item.prop == 'image'"
        #default="{ row }"
      >
        <el-image
          v-for="item in row.image"
          :key="item"
          :src="item"
          fit="cover"
          style="width: 40px; height: 40px"
        />
      </template>
      <!-- 入院老人订单合计 -->
      <template v-else-if="item.prop === 'price'" #default="{ row }">
        <span>{{ row.price }}</span>
      </template>
      <!-- 入院状态 -->
      <template
        v-else-if="item.prop === 'state' && props.identifier == 'Hospitalized'"
        #default="{ row }"
      >
        <span>{{ row.state ? "已入院" : "未入院" }}</span>
      </template>
      <!-- 出院管理 -->
      <template
        v-else-if="item.prop === 'state' && props.identifier == 'Discharge'"
        #default="{ row }"
      >
        <span>{{ row.state ? "已出院" : "待出院" }}</span>
      </template>

      <!-- 外出状态 -->
      <template
        v-else-if="item.prop === 'state' && props.identifier == 'GoOut'"
        #default="{ row }"
      >
        <span v-if="row.state == 0">待审批</span>
        <span v-if="row.state == 1">审批通过</span>
        <span v-else-if="row.state == 2">审批拒绝</span>
      </template>
      <!-- 院内活动 -->
      <template v-else-if="item.prop === 'elderly'" #default="{ row }">
        {{ row.elderly.map((item: any) => item.elderlyName).toString() }}
      </template>
      <!-- 日期格式 -->
      <template
        v-else-if="
          item.prop === 'updateTime' ||
          item.prop === 'visitTime' ||
          item.prop === 'addTime'
        "
        #default="{ row }"
      >
        <span>{{
          mons(row.updateTime || row.visitTime).format("YYYY-MM-DD")
        }}</span>
      </template>

      <!-- 奖励积分 -->
      <template v-else-if="item.prop === 'input'" #default="{}">
        <input type="text" />
      </template>
      <!-- 男女 -->
      <template v-else-if="item.prop === 'gender'" #default="{ row }">
        {{ row.gender == "1" ? "男" : "女" }}
      </template>
      <template v-else-if="item.prop == 'picture'" #default="{ row }">
        <el-image
          v-for="(pic, index) in row?.picture"
          :key="index"
          :src="upload + pic"
          class="picture"
        />
      </template>
      <!-- 排班管理 -->
      <template
        v-else-if="weekdata.includes(item.prop) && props.identifier == 'word'"
        #default="{ row }"
      >
        <div
          v-if="row[item.prop]"
          class="week"
          @click="changetab(row, item.prop)"
        >
          <div v-for="item in row[item.prop]" :key="item.id" class="item">
            <el-avatar :size="30" :src="upload + item.staffPhoto" />
            <span>{{ item.staffName }}</span>
            <div class="close">
              <el-icon class="del" @click.stop="del(item.id)">
                <CloseBold />
              </el-icon>
            </div>
          </div>
        </div>
        <div v-else>
          <span @click.stop="changetab(row, item.prop)">+请选择</span>
        </div>
      </template>
      <!-- 任务管理 -->
      <template
        v-else-if="
          (monthdata.includes(item.prop) ||
            weekdata.includes(item.prop) ||
            item.prop == 'task') &&
          props.identifier == 'schedule'
        "
        #default="{ row }"
      >
        <div
          v-if="row[item.prop]"
          :style="getstyle(row[item.prop])"
          class="schitem"
        >
          <span
            >{{ row[item.prop].startTime }}~{{ row[item.prop].endTime }}</span
          >
          <span style="margin-left: 30px; color: #575cf9">{{
            row[item.prop].serviceName
          }}</span>
        </div>
        <div v-else class="schsel">
          <span @click="selectsch(item.prop, row)">+请选择</span>
        </div>
      </template>
      <template
        v-else-if="item.prop == 'state' && props.identifier == 'Workers'"
        #default="{ row }"
      >
        <span>{{ row.state == 1 ? "已入住" : "未入住" }}</span>
      </template>
      <!-- 用药时间 -->
      <template
        v-else-if="item.prop === 'time' && props.identifier === 'planset'"
        #default="{ row }"
      >
        <MayTimeSelect
          style="width: 100%"
          @change="
            (val) => {
              row.time = val;
            }
          "
        />
      </template>
      <!-- 用药剂量 -->
      <template
        v-else-if="item.prop === 'content' && props.identifier === 'planset'"
        #default="{ row }"
      >
        <el-input v-model="row.content" />
      </template>
      <template v-else-if="item.prop === 'plans'" #default="{ row }">
        <div v-for="item in row.plans" :key="item.id">
          {{ item.time }} : {{ item.content }}
        </div>
      </template>
    </el-table-column>

    <el-table-column v-if="props.label" :label="props.label">
      <template #default="scope">
        <slot :data="scope.row" name="custom"></slot>
      </template>
    </el-table-column>

    <el-table-column
      v-if="props.isoperate"
      :width="props.autoWidth"
      label="操作"
    >
      <template #header>
        <slot name="header"></slot>
      </template>
      <template #default="scope">
        <slot :data="scope.row" :index="scope.$index" name="operate"></slot>
      </template>
    </el-table-column>
  </el-table>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import { defineAsyncComponent, defineEmits, defineProps, ref } from "vue";
import type { TableItem } from "@/Type/table";
import month from "@/database/date/month.json";
import week from "@/database/date/week.json";
import moment from "moment";
import { useApperStore } from "@/store";
import { CloseBold } from "@element-plus/icons-vue";
import AddWork from "@/components/dialog/old/elderly/AddWork.vue";
import AddSchedule from "@/components/dialog/old/elderly/AddSchedule.vue";
import { deleteSchedule } from "@/service/old/schedule/ScheduleApi";
import { ElMessage } from "element-plus";

const Emits = defineEmits(["serveListIs", "close"]);
const upload = import.meta.env.VITE_BASE_URL + "/";
const mons = moment;
// 周
const weekdata = week;
const monthdata = month;
const appStore = useApperStore();
const MayTimeSelect = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimeSelect.vue")
);
const iswodk = ref(false);
const isschedule = ref(false);
const props = defineProps({
  tableData: {
    type: Array,
    default: () => [],
  },
  tableItem: {
    type: Array as PropType<TableItem[]>,
    default: () => [],
  },
  // 是否多选
  isMultiple: {
    type: Boolean,
    default: false,
  },
  // 标识
  identifier: {
    type: String,
    default: "",
  },
  label: {
    type: String,
    default: "",
  },
  // 操作栏是否隐藏
  isoperate: {
    type: Boolean,
    default: true,
  },
  autoWidth: {
    type: String,
    default: "300px",
  },
  isShowHeader: {
    type: Boolean,
    default: true,
  },
});

// 点击单元格
const clicktab = (row: any, column: any) => {
  console.log(row, column);
};
// 选择排班
const worddata = ref({});
const changetab = (row: any, com: any) => {
  console.log(row, com);
  worddata.value = { type: row.type, com };
  console.log(111, worddata.value);

  iswodk.value = true;
};
// 关闭弹窗
const close = (isclose: boolean) => {
  if (isclose === true) {
    // getwork()
  }
  iswodk.value = false;
  isschedule.value = false;
};
// 删除排班管理
const del = async (id: number) => {
  console.log(id);
  let res: any = await deleteSchedule(id);
  console.log("删除", res);
  if (res?.code === 10000) {
    ElMessage.success("删除成功");
    Emits("close", true);
    // userType()
  }
};
// 计算时间差
const getstyle = (data: any) => {
  let startTime = moment(data.startTime, "HH:mm:ss", true).format();
  let endTime = moment(data.endTime, "HH:mm:ss", true).format();
  let height: number = moment(endTime).diff(moment(startTime), "minutes");
  let top: any = moment(data.startTime, "HH:mm:ss", true).format("mm");
  top = Number((top / 60) * 100).toFixed(2);
  // console.log(top)

  height = Number(((height / 60) * 100).toFixed(2));
  return {
    top: `${top}%`,
    height: `${height}%`,
  };
};
// 在函数中使用inject
// const userType: any = app.runWithContext(() => {
//   // 拿到app中注入的userType字段
//   // console.log(props.identifier == 'word' ? inject('getwork') : null)
//   return props.identifier === 'word' ? inject('getwork') : null
// })

// 添加行样式
const cellstyle = ({ row, column, rowIndex, columnIndex }: any) => {
  if (props.identifier == "schedule") {
    return "height: 60px;";
  }
};

// 获取计划任务
const Scheduledata = ref();
// 获取开始时间
const startTime = ref("");
// 新增任务
const selectsch = (row: any, prop: any) => {
  console.log(111, row);
  startTime.value = moment(prop.min, "HH", true).format("HH:mm");
  console.log(startTime.value);
  Scheduledata.value = row;
  console.log(Scheduledata.value);

  isschedule.value = true;
};
// 多选
const handleSelectionChange = (val: any[]) => {
  console.log("多选返回值", val);
  Emits("serveListIs", val);
};
</script>

<style lang="less" scoped>
.picture {
  width: 50px;
  height: 50px;
  margin-right: 10px;
}

// 变小手
.item {
  display: flex;
  align-items: center;
  position: relative;
  margin-bottom: 5px;

  span {
    margin-left: 5px;
  }
}

.close {
  position: absolute;
  top: -1px;
  left: 25px;
  background-color: #ccc;
  //width: 15px;
  //height: 15px;
  border-radius: 50%;
  color: black;
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  padding: 2px;

  .del {
    font-size: 12px;
  }
}

.schitem {
  width: 100%;
  height: 100%;
  background-color: #b7efff;
  box-shadow: 0 0 5px #b7efff;
  position: absolute;
  top: 0;
  left: 0;
  //display: flex;
  //flex-direction: column;
  padding-left: 5px;
  z-index: 999;

  span {
    margin-top: 5px;
    color: #5799f9;
  }
}

.schsel {
  width: 100%;
  height: 100%;
  font-size: 12px;
}
</style>
