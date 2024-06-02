<template>
  <!-- 新增预定 -->
  <div class="app-container">
    <el-card>
    <div class="title">
      <div><i>▋</i> 预定信息</div>
    </div>
    <el-form
      :inline="true"
      label-position="top"
      ref="ruleFormRef"
      :model="params"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      :size="formSize"
      status-icon
    >
      <el-form-item label="预定人姓名：" prop="name">
        <el-input v-model="params.name" placeholder="请输入姓名" />
      </el-form-item>
      <el-form-item label="预定人电话:" prop="mobile">
        <el-input v-model="params.mobile" placeholder="请输入预定人电话" />
      </el-form-item>
      <el-form-item label="与老人关系:" prop="relation">
        <el-select v-model="params.relation" placeholder="请选择">
          <el-option label="父子关系" value="父子关系" />
          <el-option label="父女关系" value="父女关系" />
          <el-option label="母子关系" value="母子关系" />
          <el-option label="母女关系" value="母女关系" />
          <el-option label="其他" value="其他" />
        </el-select>
      </el-form-item>
      <el-form-item label="预定床位:" prop="begId">
        <el-cascader
          v-model="params.begId"
          style="width: 499px"
          :options="options"
          :props="props"
          @change="handleChange"
        />
      </el-form-item>
      <el-form-item label="开始日期:" prop="startDate">
        <MayTimePicker
          @change="change"
          :remtime="remtime"
          :format="'YYYY-MM-DD'"
          :valueFormat="'YYYY-MM-DD'"
          style="width: 479px"
        />
      </el-form-item>
      <el-form-item label="预定时长（天）:" prop="day">
        <el-input v-model="params.day" placeholder="请输入预定时长" />
      </el-form-item>
      <el-form-item label="定金应收:" prop="amount">
        <el-input v-model="params.amount" placeholder="请输入定金应收" />
      </el-form-item>
    </el-form>
    <div class="title" style="margin-top: 20px">
      <div><i>▋</i> 预定协议</div>
    </div>
    <div class="box">
      <UploadVideo
        :text="'上传协议'"
        :limit="3"
        :showlist="getUploadPictures"
        class="uploadpic"
        @upload="pictureupload"
        @uploadrem="picturerem"
      />
      <el-button class="download">下载预定协议</el-button>
    </div>
    <!-- 按钮 -->
    <div class="btn">
      <el-button type="primary" @click="save">保存暂不提交</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)"
        >保存并提交</el-button
      >
      <el-button @click="cancel">取消</el-button>
    </div>
  </el-card>
  </div>
  
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted, defineAsyncComponent } from "vue";
import { ElMessage } from "element-plus";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import {
  ConfigBuildingList,
  getHouseList,
  getBedsList,
} from "@/service/config/ConfigApi";
import {
  reservationAdd,
  reservationget,
  reservationUpdate,
} from "@/service/market/ReserveApi";
import type { ReservationAddParams } from "@/service/market/Reservetype";
import type { UploadUserFile } from "element-plus";
import { useRouter, useRoute } from "vue-router";
import MayTimePicker from "@/components/timepicker/MayTimePicker.vue";
const router = useRouter();
const route = useRoute();
const getUploadPictures = ref<UploadUserFile[]>([]);
const remtime = ref<string>("");
const UploadVideo = defineAsyncComponent(
  () => import("@/components/upload/UploadVideo.vue")
);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const params = reactive<ReservationAddParams>({
  id: 0,
  elderlyId: undefined,
  name: "",
  mobile: "",
  relation: "",
  begId: undefined,
  startDate: "",
  day: undefined,
  amount: undefined,
  files: [],
});
const rules = reactive<FormRules<ReservationAddParams>>({
  name: [{ required: true, message: "请输入预定人姓名", trigger: "blur" }],
  mobile: [{ required: true, message: "请输入预定人电话", trigger: "change" }],
  relation: [
    { required: true, message: "请输入与老人关系", trigger: "change" },
  ],
  begId: [{ required: true, message: "请输入预定床位", trigger: "change" }],
  startDate: [{ required: true, message: "请输入开始日期", trigger: "change" }],
  day: [{ required: true, message: "请输入预定时长", trigger: "change" }],
  amount: [{ required: true, message: "请输入定金应收", trigger: "change" }],
});

// 时间
const change = (val: any) => {
  params.startDate = val;
};

// 增加上传协议
const pictureupload = (val: any) => {
  params.files.push({ file: val.url });
};

// 移除上传协议
const picturerem = (val: any) => {
  const hasFile = params.files.some((item, index) => {
    if (item.file == val) {
      params.files.splice(index, 1);
      return true;
    } else if (item.file == val.url) {
      params.files.splice(index, 1);
      return true;
    }
    return false;
  });
  if (!hasFile) {
    console.log("文件未找到，无法移除");
  }
};

const save = () => {
  console.log(params);
};

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (params.id == 0) {
        const res: any = await reservationAdd(params);
        if (res.code === 10000) {
          ElMessage.success("添加成功");
          router.push("/market/reserve");
        } else {
          ElMessage.error(res.msg);
        }
      } else {
        const res: any = await reservationUpdate(params);
        if (res.code === 10000) {
          ElMessage.success("修改成功");
          router.push("/market/reserve");
        } else {
          ElMessage.error(res.msg);
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 数据回显
const getData = async () => {
  let id = route.params?.id;
  if (!id) return false;
  const res: any = await reservationget(Number(id)).catch(() => {});
  if (res.code === 10000) {
    Object.assign(params, res.data);
    // 上传协议回显
    if (res.data.files) {
      getUploadPictures.value = res.data.files.map((item: any) => {
        return {
          url: item.file,
          name: item.file,
        };
      });
    }
    // 时间回显
    console.log(res.data.startDate);
    if (res.data.startDate) {
      remtime.value = res.data.startDate;
    }
  }
};

// 老人id
const elderlyId = () => {
  let elderlyId = route.query.oldId;
  if (elderlyId) {
    params.elderlyId = Number(elderlyId);
    params.id = 0;
  }
};

// 取消
const cancel = () => {
  router.push("/market/reserve");
};

// 级联选择器

const props = {
  children: "children",
  value: "id",
  label: "name",
};

const handleChange = (value: any) => {
  console.log(value);
  if (value.length == 4) {
    params.begId = value[value.length - 1];
    console.log(params.begId);
  } else {
    params.begId = undefined;
  }
};

const options = ref([]);

// 预定床位
const reserve = async () => {
  // 楼栋列表
  let building = await buildingList();
  // 房间列表
  let house = await houseList();
  // 床位列表
  let bed = await bedList();

  function convertToTree(flatData: any, pid: number = 0) {
    const children = flatData.filter((node: any) => node.pid == pid);
    if (!children.length) {
      return house
        .filter((item: any) => item.buildingId == pid)
        .map((item: any) => ({
          id: item.id,
          name: item.name,
          pid: item.buildingId,
          children: bed
            .filter((bitem: any) => bitem.houseId == item.id)
            .map((sitem: any) => ({
              id: sitem.id,
              name: sitem.name,
            })),
        }));
    }
    return children.map((node: any) => ({
      ...node,
      children: convertToTree(flatData, node.id),
    }));
  }
  // let tree =
  // console.log('数据', tree);
  options.value = convertToTree(building, 0);
};

// 楼栋列表
const buildingList = async () => {
  const res: any = await ConfigBuildingList();
  // console.log('楼栋列表', res);
  if (res.code == 10000) {
    return res.data.list;
  }
};
// 房间列表
const houseList = async () => {
  const res: any = await getHouseList();
  // console.log('房间列表', res);
  if (res.code === 10000) {
    return res.data.list;
  }
};
// 床位列表
const bedList = async () => {
  const res: any = await getBedsList();
  // console.log('床位列表', res);
  if (res.code === 10000) {
    return res.data.list;
  }
};

onMounted(() => {
  // 预定
  reserve();
  getData();
  elderlyId();
});
</script>
<style lang="less" scoped>
.title {
  margin-left: 40px;
  margin-bottom: 30px;

  i {
    font-style: normal;
    color: #409eff;
  }
}

.el-form-item {
  margin-left: 40px;
  width: 479px;
}

.box {
  margin-left: 40px;
  width: 400px;
  position: relative;

  .download {
    position: absolute;
    top: -0.1px;
    left: 120px;
  }
}

.btn {
  text-align: center;
  margin-top: 50px;
  margin-bottom: 50px;
}
.uploadpic {
  margin-left: 5px;
}
</style>
