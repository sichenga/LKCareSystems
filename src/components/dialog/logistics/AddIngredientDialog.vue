<template>
  <el-dialog v-model="dialogVisible" title="选择喜欢的食材" @close="close">
    <el-form
      ref="ruleFormRef"
      style="max-width: 1000px"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <MayTable
        @serve-list-is="handleSelectionChange"
        :tableData="data.tableData"
        :tableItem="data.tableItem"
        :isoperate="isoperate"
        :isMultiple="isMultiple"
      />
    </el-form>
    <Pagination
      @psize="handlePsize"
      @page="handlePage"
      :page="params.page"
      :psize="params.pageSize"
      :total="params.total"
    />
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submitForm"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import {
  ref,
  reactive,
  defineEmits,
  onMounted,
  defineAsyncComponent,
} from "vue";
import type { ComponentSize, FormInstance } from "element-plus";
import { FoodList } from "@/service/food/FoodApi";
import type { Supplier } from "@/service/food/FoodType";
import { useUserStore } from "@/store";
const useUser = useUserStore();

const MayTable = defineAsyncComponent(
  () => import("@/components/table/MayTable.vue")
);
const Pagination = defineAsyncComponent(
  () => import("@/components/pagination/MayPagination.vue")
);
const isoperate = ref(false);
const isMultiple = ref(true);

const params: Supplier = reactive({
  pageSize: 10,
  page: 1,
  total: 0,
});

const data = reactive({
  tableData: [] as any,
  tableItem: [
    {
      prop: "id",
      label: "序号",
    },
    {
      prop: "name",
      label: "物料名称",
    },
    {
      prop: "unit",
      label: "单位",
    },
    {
      prop: "supplierName",
      label: "供应商",
    },
    {
      prop: "wholePrice",
      label: "批发价",
    },
    {
      prop: "sellPrice",
      label: "零售价",
    },
    {
      prop: "purchasePrice",
      label: "采购价",
    },
  ],
});

const formSize = ref<ComponentSize>("default");

const ruleFormRef = ref<FormInstance>();

const dialogVisible = ref(true);

const emit = defineEmits(["close", "ingredient"]);
// 关闭弹框
const close = (close: boolean = false) => {
  emit("close", close);
};

// 分页
const handlePsize = (val: any) => {
  params.pageSize = val;
  gerFoodList();
};
const handlePage = (val: any) => {
  params.page = val;
  gerFoodList();
};

const multipleSelection = ref<any[]>([]);

const handleSelectionChange = (val: any[]) => {
  multipleSelection.value = val;
};
// 提交表单
const submitForm = async () => {
  // console.log(3333, multipleSelection.value);
  useUser.ingredients(multipleSelection.value);
  emit("ingredient", useUser.ingredient);
  close(true);
};

//获取食材
const gerFoodList = async () => {
  let res: any = await FoodList(params);

  if (res.code === 10000) {
    params.total = res.data.counts;
    data.tableData = res.data.list;
  }
};

onMounted(() => {
  gerFoodList(); //获取食材
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
</style>
