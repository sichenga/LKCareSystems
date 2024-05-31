<template>
  <div>
    <div class="top-body">
      <div>
        <div class="content-size">
          <el-image
            style="width: 50px; height: 50px; border-radius: 50%"
            :src="Image + DataElder.photo"
            fit="cover"
          />
          <div class="size-cont">
            <div>
              <div>老人姓名：</div>
              <div>身份证号：</div>
            </div>
            <div>
              <div>{{ DataElder.name }}</div>
              <div>{{ DataElder.idCard }}</div>
            </div>
          </div>
        </div>
      </div>
      <div class="Table">
        <div class="table-body">
          <div class="family">家属信息：</div>
          <div>
            <MayTable
              :tableData="data.tableData"
              :tableItem="data.tableItem"
              :isoperate="false"
            />
          </div>
        </div>
      </div>
    </div>
    <div class="content-sizes">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        class="demo-ruleForm"
        status-icon
      >
        <div class="font-sizes">
          <span class="color-size">▋</span>
          <span class="option">订单总费用</span>
          <span class="option"
            >({{ ruleForm.startDate }} 至
            {{ overTime(ruleForm.startDate, ruleForm.days) }})</span
          >
        </div>
        <div class="margin-size">
          <MayTable
            :tableData="data.tableDatas"
            :tableItem="data.tableItems"
            :isoperate="false"
          >
            <template #operate="{ data }">
              <div>
                {{ data }}
              </div>
            </template>
          </MayTable>
        </div>

        <div class="font-sizes">
          <span class="color-size">▋</span>
          <span class="option">入院费用核定</span>
          <span class="option"
            >({{ ruleForm.startDate }} 至
            {{ overTime(ruleForm.startDate, ruleForm.payDays) }})</span
          >
        </div>
        <div class="margin-size">
          <MayTable
            :tableData="data.tableDatais"
            :tableItem="data.tableItemis"
            :isoperate="false"
          />
        </div>
        <div class="font-sizes">
          <span class="color-size">▋</span>
          <span class="option">上传合同</span>
        </div>
        <el-form-item>
          <UploadImg :showlist="false" @upload="handlUpload" />
          <el-button class="button-sizess">下载预定协议</el-button>
          <div class="demo-image__preview">
            <img
              v-for="(item, index) in img"
              :key="index"
              :src="Image + item"
              class="avatar"
            />
          </div>
        </el-form-item>
        <el-form-item class="button-size">
          <el-button type="primary" @click="sond"> 上一步 </el-button>
          <el-button type="primary" @click="submitForm(1)">
            保存暂不提交
          </el-button>
          <el-button type="primary" @click="submitForm(2)">
            保存并提交
          </el-button>
          <el-button>返回</el-button>
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  onMounted,
  defineAsyncComponent,
  defineEmits,
  inject,
} from "vue";
import type { FormInstance } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { getElderly } from "@/service/old/OldApi";
import { orderAdd } from "@/service/market/marketApi";
import { ElMessage } from "element-plus";
import { orderGet, orderupdate } from "@/service/market/marketApi";
import type { orderAdds } from "@/service/market/marketType";
import UploadImg from "@/components/upload/UploadImg.vue";
const router = useRouter();
const route = useRoute();
const ruleForm = inject<orderAdds>("ruleForm")!;
console.log(11111, ruleForm);

const emits = defineEmits(["isshou"]);
const Image = import.meta.env.VITE_BASE_URL + "/";
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const ruleFormRef = ref<FormInstance>();

// 编辑回显数据
const params = ref<any>([]);
const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "name",
      label: "家属姓名",
      width: "150px",
    },
    {
      prop: "relation",
      label: "与老人关系",
      width: "150px",
    },
    {
      prop: "mobile",
      label: "联系方式",
      width: "150px",
    },
  ],
  tableDatas: [] as any,
  tableItems: [
    {
      prop: "id",
      label: "顺序",
    },
    {
      prop: "name",
      label: "项目名称",
    },
    {
      prop: "price",
      label: "小计（元）",
    },
  ],
  tableDatais: [] as any,
  tableItemis: [
    {
      prop: "id",
      label: "顺序",
    },
    {
      prop: "name",
      label: "项目名称",
    },
    {
      prop: "price",
      label: "小计（元）",
    },
  ],
});

// 保存
// emits('isshou', 1)
const submitForm = async (index: number) => {
  let res: any;
  if (params.value.id) {
    if (index == 1) {
      //修改老人
      ruleForm.state = 0; //表示保存暂不提交
      res = await orderupdate(ruleForm);
    } else {
      //修改老人
      ruleForm.state = 1; //表示保存并提交
      console.log(ruleForm);
      res = await orderupdate(ruleForm);
    }
    if (res?.code == 10000) {
      router.push("/market/hospitalized");
      ElMessage.success(index == 1 ? "编辑暂不提交成功" : "编辑并提交成功");
    }
  } else {
    if (index == 1) {
      ruleForm.state = 0; //表示保存暂不提交
      res = await orderAdd(ruleForm).catch(() => {});
    } else {
      ruleForm.state = 1; //表示保存并提交
      res = await orderAdd(ruleForm).catch(() => {});
    }
    if (res?.code == 10000) {
      router.push("/market/hospitalized");
      ElMessage.success(index == 1 ? "保存暂不提交成功" : "保存并提交成功");
    }
  }
};
// 返回
const sond = () => {
  emits("isshou", 0);
};
// 获取老人信息
const DataElder = ref<any>([]);
const getElderlyList = async () => {
  let id = Number(route.query.oldId);
  let res: any = await getElderly(id);

  if (res?.code == 10000) {
    DataElder.value = res.data;
    data.tableData = res.data.family;
  }
};
//订单总费用
const totle = ref<number>(0);
const getPrioce = async () => {
  data.tableDatas = [
    {
      id: 1,
      name: "床位费",
      price: Number(ruleForm.begPrice) * Number(ruleForm.days),
    },
    {
      id: 2,
      name: "护理费",
      price: Number(ruleForm.servicePrice) * Number(ruleForm.days),
    },
    {
      id: 3,
      name: "膳食费",
      price: Number(ruleForm.foodPrice) * Number(ruleForm.days),
    },
    {
      id: 4,
      name: "押金",
      price: Number(ruleForm.cashPledge) * Number(ruleForm.days),
    },
    {
      id: 5,
      name: "一次性生活费",
      price: Number(ruleForm.livingPrice) * Number(ruleForm.days),
    },
    {
      name: "合计",
      price: totle,
    },
  ];

  totle.value = data.tableDatas.reduce((acc: any, cur: any) => {
    return acc + Number(cur.price);
  }, 0);
};
//入院费用核定
const totles = ref<number>(0);
const getPrioces = async () => {
  data.tableDatais = [
    {
      id: 1,
      name: "床位费",
      price: Number(ruleForm.begPrice) * Number(ruleForm.payDays),
    },
    {
      id: 2,
      name: "护理费",
      price: Number(ruleForm.servicePrice) * Number(ruleForm.payDays),
    },
    {
      id: 3,
      name: "膳食费",
      price: Number(ruleForm.foodPrice) * Number(ruleForm.payDays),
    },
    {
      id: 4,
      name: "押金",
      price: Number(ruleForm.cashPledge) * Number(ruleForm.payDays),
    },
    {
      id: 5,
      name: "一次性生活费",
      price: Number(ruleForm.livingPrice) * Number(ruleForm.payDays),
    },
    {
      name: "合计",
      price: totles,
    },
  ];

  totles.value = data.tableDatais.reduce((acc: any, cur: any) => {
    return acc + Number(cur.price);
  }, 0);
};
// 认证
const img = ref<any>([]);
const handlUpload = (val: any) => {
  img.value.push(val);
  ruleForm.files = img.value.map((item: any) => ({ file: item }));
};
//获取单挑入院列表
const getOrderlist = async () => {
  let ids = route.query?.ids;
  if (ids) {
    let res: any = await orderGet(Number(ids));
    if (res?.code == 10000) {
      params.value = res.data;
      img.value = res.data.files.map((item: any) => item.file);
    }
  }
};

// 计算结束日期
import moment from "moment";
const overTime = (startDate: any, day: any) => {
  return moment(startDate).add(day, "days").format("YYYY-MM-DD");
};
onMounted(() => {
  getElderlyList(); // 获取老人信息
  getPrioce(); //合计 订单费用入院费用
  getPrioces(); //入院费用核定 费用核定
  getOrderlist(); //获取单挑入院列表
});
</script>
<style lang="less" scoped>
.top-body {
  display: flex;
  justify-content: space-between;
  margin-left: 20px;
  margin-top: 50px;
  margin-bottom: 60px;

  .content-size {
    display: flex;
    width: 400px;

    .size-cont {
      display: flex;
      width: 215px;
      margin-left: 30px;
      justify-content: space-between;
    }
  }

  .Table {
    .table-body {
      display: flex;

      .family {
        margin-top: 10px;
      }
    }
  }
}

.margin-size {
  margin-top: 20px;
  margin-bottom: 50px;
}

.el-form-item {
  margin-top: 35px;
}

.button-size {
  margin-top: 120px;
  margin-left: 484px;
}

.content-sizes {
  .font-sizes {
    font-size: 14px;

    .color-size {
      color: #409eff;
    }

    .option {
      font-weight: 650;
      color: #666666;
      margin-left: 6px;
      margin-right: 30px;
    }
  }
}

:deep(.el-upload) {
  position: absolute;
  top: 0;
}

.button-sizess {
  position: absolute;
  top: 0;
  left: 100px;
}

.demo-image__preview {
  margin-top: 80px;

  .avatar {
    width: 80px;
    height: 80px;
  }
}
</style>
