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
        style="max-width: 400px"
        :model="ruleForm"
        :rules="rules"
        label-width="auto"
        class="demo-ruleForm"
        size
        status-icon
      >
        <div class="font-sizes">
          <span class="color-size">▋</span>
          <span class="option">选择床位</span>
          <span>床位费合计：{{ ruleForm.begPrice! * ruleForm.days! }}</span>
        </div>
        <div class="margin-size">
          <el-form-item label="选择床位:" prop="begId">
            <MayCascader
              :options="DataBedsList"
              @change="bedselect"
              :emitid="ruleForm.begId ? Number(ruleForm.begId) : 0"
            />
          </el-form-item>
          <el-form-item label="床位单价:" prop="begPrice">
            <el-input-number
              controls-position="right"
              v-model="ruleForm.begPrice"
              :min="0"
              :max="10000000000"
              placeholder="200/天"
            />
          </el-form-item>
          <el-form-item label="入住天数:" prop="days">
            <el-input-number
              controls-position="right"
              v-model="ruleForm.days"
              :min="0"
              :max="10000000000"
              placeholder="请输入"
            />
          </el-form-item>
          <el-form-item label="入住日期:" prop="startDate">
            <MayTimePicker
              @change="handlChange"
              :remtime="params.startDate"
              :valueFormat="'YYYY-MM-DD'"
            />
          </el-form-item>
        </div>
        <div class="font-sizes">
          <span class="color-size">▋</span>
          <span class="option">餐饮膳食</span>
          <span>伙食费合计：{{ ruleForm.foodPrice! * ruleForm.days! }}</span>
        </div>
        <div class="margin-size">
          <el-form-item label="套餐单价:" prop="foodPrice">
            <el-input-number
              controls-position="right"
              :min="0"
              :max="10000000000"
              v-model="ruleForm.foodPrice"
              placeholder="25/天"
            />
          </el-form-item>
        </div>
        <div class="font-sizes">
          <span class="color-size">▋</span>
          <span class="option">护理服务</span>
          <span>护理费合计：{{ ruleForm.servicePrice! * ruleForm.days! }}</span>
        </div>
        <div class="margin-size">
          <el-form-item label="护理费:" prop="servicePrice">
            <el-input-number
              controls-position="right"
              v-model="ruleForm.servicePrice"
              placeholder="100/天"
              :min="1"
              :max="10000000000"
            />
          </el-form-item>
          <el-button type="primary" style="margin-bottom: 20px" @click="add"
            >添加服务</el-button
          >

          <hospitalizedDialog
            v-if="dialogVisible"
            @close="handleClose"
            @serve-list="serveList"
          />

          <MayTable
            :tableData="data.tableDatas"
            :tableItem="data.tableItems"
            :isoperate="false"
          />
        </div>
        <div class="font-sizes">
          <span class="color-size">▋</span>
          <span class="option">其他收费</span>
        </div>
        <div class="margin-size">
          <el-form-item label="押金:" prop="cashPledge">
            <el-input-number
              controls-position="right"
              v-model="ruleForm.cashPledge"
              placeholder="请输入"
              :min="0"
              :max="10000000000"
            />
          </el-form-item>
          <el-form-item label="一次性生活费 :" prop="livingPrice">
            <el-input-number
              controls-position="right"
              v-model="ruleForm.livingPrice"
              placeholder="请输入"
              :min="0"
              :max="10000000000"
            />
          </el-form-item>
        </div>
        <div class="font-sizes">
          <span class="color-size">▋</span>
          <span class="option">入院费用核定周期设置</span>
        </div>
        <div class="margin-size">
          <el-form-item label="入院费用核定天数:" prop="payDays">
            <el-input-number
              controls-position="right"
              v-model="ruleForm.payDays"
              placeholder="请输入"
            />
          </el-form-item>
        </div>
        <el-form-item class="button-size">
          <el-button @click="sond">返回</el-button>
          <el-button type="primary" @click="submitForm(ruleFormRef)">
            下一步
          </el-button>
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
import type { FormInstance, FormRules } from "element-plus";
import { getElderly } from "@/service/old/OldApi";
import MayCascader from "@/components/cascader/MayCascader.vue";
import type { BedsList } from "@/service/config/ConfigType";
import { orderGet } from "@/service/market/marketApi";
import type { orderAdds } from "@/service/market/marketType";
import hospitalizedDialog from "@/components/dialog/hospitalized/hospitalizedDialog.vue";
import { useRouter, useRoute } from "vue-router";
import { useBuildStroke } from "@/store";
const buildstore = useBuildStroke();
const Image = import.meta.env.VITE_BASE_URL + "/";
const router = useRouter();
const route = useRoute();
const ruleForm = inject<orderAdds>("ruleForm")!;

const emits = defineEmits(["isshou"]);
const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const MayTimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
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
      prop: "name",
      label: "服务项目",
      width: "150px",
    },
    {
      prop: "content",
      label: "服务内容",
      width: "150px",
    },
    {
      prop: "elderlyName",
      label: "合计",
      width: "150px",
    },
  ],
});

const rules = reactive<FormRules<orderAdds>>({
  begPrice: [{ required: true, message: "请输入床位单价", trigger: "blur" }],
  days: [{ required: true, message: "请输入入住天数", trigger: "blur" }],
  foodPrice: [{ required: true, message: "请输入套餐单价", trigger: "blur" }],
  servicePrice: [{ required: true, message: "请输入护理费", trigger: "blur" }],
  cashPledge: [{ required: true, message: "请输入押金", trigger: "blur" }],
  livingPrice: [
    { required: true, message: "请输入一次性生活费", trigger: "blur" },
  ],
  payDays: [{ required: true, message: "请输入费用核定天数", trigger: "blur" }],
  begId: [
    {
      required: true,
      message: "请选择床位",
      trigger: "change",
    },
  ],
  startDate: [
    {
      required: true,
      message: "请选择入住日期",
      trigger: "change",
    },
  ],
});

// 下一步
const submitForm = async (formEl: any | undefined) => {
  if (!formEl) return;
  await formEl.validate((valid: any) => {
    if (valid) {
      emits("isshou", 1);
    }
  });
};
// 返回
const sond = () => {
  router.push("/market/hospitalized");
};
// 入住时间
const handlChange = (val: any) => {
  ruleForm.startDate = val;
};
// 获取老人单挑信息
const DataElder = ref<any>([]);
const getElderlyL = async () => {
  let id = Number(route.query.oldId);
  let res: any = await getElderly(id);
  if (res?.code == 10000) {
    DataElder.value = res.data;
    data.tableData = res.data.family;
  }
};
//添加服务
const dialogVisible = ref(false);
const handleClose = (val: any) => {
  dialogVisible.value = val;
  if (val == true) {
    dialogVisible.value = false;
  }
};
//选择的服务数据
const serveList = (val: any) => {
  data.tableDatas = val;
  ruleForm.services = val.map((item: any) => ({ serviceId: item.id }));
};
const add = () => {
  dialogVisible.value = true;
};
const stats = reactive<BedsList>({
  page: 1,
  pageSize: 10,
  houseId: null,
});
// 床位列表
const DataBedsList = ref<any>([]);
const getElderlyLists = async () => {
  DataBedsList.value = await buildstore.getBuildListData();
};
//获取单挑入院列表
const getOrderlist = async () => {
  let ids = route.query?.ids;
  if (ids) {
    let res: any = await orderGet(Number(ids));
    if (res?.code == 10000) {
      params.value = res.data;
      data.tableDatas = res.data.services.map((item: any) => ({
        name: item.serviceName,
        content: item.serviceContent,
        elderlyName: item.elderlyName,
      }));
      Object.assign(ruleForm, res.data);
      console.log(ruleForm, "ruleForm");
    }
  }
};
// 选择床位
const bedselect = (val: number) => {
  ruleForm.begId = val;
};

onMounted(async () => {
  getElderlyL(); // 获取老人单挑信息
  getElderlyLists(); //床位列表
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
  margin-bottom: 50px;
}

.el-form-item {
  margin-top: 35px;
}

.button-size {
  margin-left: 254px;
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
</style>
