<template>
  <div class="app-container">
    <!-- 新增外出 -->
    <el-card>
      <el-form
        ref="ruleFormRef"
        style="max-width: 400px"
        :model="ruleForm"
        label-width="auto"
        class="demo-ruleForm"
        :size="formSize"
        status-icon
      >
        <el-form-item label="选择外出老人:">
          <el-input v-model="data.oldlist" disabled />
        </el-form-item>
        <el-form-item label="外出时间:">
          <DateTimePicke
            @change="handlChange"
            :valueformat="'YYYY-MM-DD HH:mm:ss'"
            :format="'YYYY-MM-DD HH:mm'"
            :statetime="times[0]"
            :endtime="times[1]"
          />
        </el-form-item>
        <el-form-item label="陪同人员类型:">
          <el-select
            v-model="ruleForm.relation"
            clearable
            placeholder="请选择"
            style="width: 300px"
          >
            <el-option
              v-for="item in typelist"
              :key="item"
              :label="item"
              :value="item"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="陪同人员姓名:">
          <el-input v-model="ruleForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="陪同人员电话:">
          <el-input v-model="ruleForm.mobile" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="陪同人员地址:">
          <el-input v-model="ruleForm.address" placeholder="请输入" />
        </el-form-item>
        <el-form-item label="外出原因:">
          <el-input
            v-model="ruleForm.content"
            placeholder="请输入原因"
            type="textarea"
            style="width: 300px"
          />
        </el-form-item>
      </el-form>
      <div class="submit">
        <el-button @click="cancel">取消</el-button>
        <el-button type="primary" @click="add">保存</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import type { ComponentSize, FormInstance } from "element-plus";
import { ElMessage } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import { AddGooutList, goOutList, UpdateGoout } from "@/service/care/gooutApi";
import { getElderly } from "@/service/old/OldApi";
import type { AddGoout } from "@/service/care/gooutType";
const router = useRouter();
const route = useRoute();
const DateTimePicke = defineAsyncComponent(
  () => import("@/components/timepicker/MayDateTimePicker.vue")
);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AddGoout>({
  elderlyId: null, //老人Id
  startTime: "", //开始时间yyyy-MM-dd
  endTime: "", //结束时间yyyy-MM-dd
  mobile: "", //手机号联系方式
  address: "", //去处 地址
  content: "", //出去理由
  relation: "", //关系
  name: "", //老人姓名
});
//时间回显
const times = ref<any>([]);
const goOutListData = async () => {
  if (route.params?.id) {
    let id = Number(route.params.id);
    let res: any = await goOutList(id);
    if (res?.code == 10000) {
      times.value.push(res.data.startTime, res.data.endTime);

      Object.assign(ruleForm, res.data);
      data.oldlist = res.data.elderlyName;
    }
  }
};
//开始结束日期
const handlChange = (val: any) => {
  ruleForm.startTime = val[0];
  ruleForm.endTime = val[1];
};
const data = reactive<any>({
  oldlist: [] as any,
});
const typelist = [
  "父子",
  "母子",
  "父女",
  "母女",
  "兄弟",
  "姐妹",
  "朋友",
  "其他",
  "本人",
  "护理人员",
];
// 取消提交
const cancel = () => {
  router.push("/care/goout");
};

// 提交表单
const add = async () => {
  let res: any;
  if (route.params.id) {
    res = await UpdateGoout(ruleForm);
  } else {
    res = await AddGooutList(ruleForm);
  }
  if (res?.code == 10000) {
    router.push("/care/goout");
    ElMessage.success(route.params.id ? "修改成功" : "添加成功");
  }
};

//老人列表
const getOldList = async () => {
  if (route.query.oldId) {
    let oldId = Number(route.query.oldId);
    ruleForm.elderlyId = oldId;
    let res: any = await getElderly(oldId);
    if (res?.code == 10000) {
      data.oldlist = res.data.name;
    }
  }
};
onMounted(() => {
  getOldList(); //老人列表
  goOutListData(); //获取单挑外出列表
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}

.submit {
  width: 100%;
  display: flex;
  // justify-content: center;
  margin-top: 20px;
}
// width: 419px
.el-form-item {
  width: 419px;
}
</style>
