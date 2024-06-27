<!-- daw2 -->
<template>
  <el-form
    ref="ruleFormRef"
    :model="ruleForm"
    :rules="rules"
    class="demo-ruleForm"
    label-width="auto"
    status-icon
    style="max-width: 500px"
  >
    <div>
      <el-form-item label="老人姓名：" prop="name">
        <el-input v-model="ruleForm.name" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="性别：" prop="gender">
        <el-radio-group v-model="ruleForm.gender">
          <el-radio :value="1">男</el-radio>
          <el-radio :value="0">女</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="出生日期：" prop="birthday">
        <MayTimePicker
          :format="'YYYY-MM-DD'"
          :remtime="ruleForm.birthday"
          :value-format="'YYYY-MM-DD'"
          style="width: 100%"
          @change="selecttime"
        />
      </el-form-item>
      <el-form-item label="籍贯：" prop="nativePlace">
        <el-select v-model="ruleForm.nativePlace" placeholder="请选择">
          <el-option
            v-for="(item, index) in data.nativePlacedata"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="民族：" prop="nation">
        <el-select v-model="ruleForm.nation" placeholder="请选择">
          <el-option
            v-for="(item, index) in data.nationdata"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="身份证号码：" prop="idCard">
        <el-input v-model="ruleForm.idCard" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="政治面貌：" prop="politics">
        <el-select v-model="ruleForm.politics" placeholder="请选择">
          <el-option
            v-for="(item, index) in data.politicsdata"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="社保卡号：" prop="socialCard">
        <el-input v-model="ruleForm.socialCard" placeholder="请输入" />
      </el-form-item>
      <el-form-item label="婚姻状况：" prop="marriage">
        <el-radio-group v-model="ruleForm.marriage">
          <el-radio value="已婚">已婚</el-radio>
          <el-radio value="离婚">离婚</el-radio>
          <el-radio value="丧偶">丧偶</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="受教育程度：" prop="eduLevel">
        <el-radio-group v-model="ruleForm.eduLevel">
          <el-radio value="文盲">文盲</el-radio>
          <el-radio value="略识文字">略识文字</el-radio>
          <el-radio value="能读写">能读写</el-radio>
        </el-radio-group>
      </el-form-item>
      <el-form-item label="最高学历：" prop="education">
        <el-select v-model="ruleForm.education" placeholder="请选择">
          <el-option
            v-for="(item, index) in data.eduLeveldata"
            :key="index"
            :label="item"
            :value="item"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="户口所在地：" prop="resident">
        <el-input
          v-model="ruleForm.resident"
          placeholder="区/路（存）/弄/号/室"
        />
      </el-form-item>
      <el-form-item label="现在居住地址：" prop="address">
        <el-input
          v-model="ruleForm.address"
          placeholder="区/路（存）/弄/号/室"
        />
      </el-form-item>
      <el-form-item class="demo-ruleForm-but" />
    </div>
    <div class="images">
      <UploadPictures
        :editdata="ruleForm.photo"
        :style="{ width: '150px', height: '150px' }"
        @upload="(val) => (ruleForm.photo = val)"
      />
    </div>
  </el-form>
</template>
<script lang="ts" setup>
import {
  defineAsyncComponent,
  defineExpose,
  inject,
  onMounted,
  reactive,
  ref,
} from "vue";
import type { FormInstance, FormRules } from "element-plus";
// 民族数据
import nation from "@/database/nation/nation.json";
// 籍贯数据 nativePlace
import nativePlace from "@/database/nativePlace/nativePlace.json";
// 政治面貌数据
import politics from "@/database/politics/politics.json";
// 最高学历数据
import eduLevel from "@/database/eduLevel/eduLevel.json";
import type { AddElderlyRequest } from "@/service/old/OldType";

const UploadPictures = defineAsyncComponent(
  () => import("@/components/upload/AvatarUpload.vue")
);
const MayTimePicker = defineAsyncComponent(
  () => import("@/components/timepicker/MayTimePicker.vue")
);
const ruleFormRef = ref<FormInstance>();
const ruleForm = inject<AddElderlyRequest>("ruleForm")!;
const rules = reactive<FormRules<any>>({
  name: [
    {
      required: true,
      message: "请输入老人姓名",
      trigger: "blur",
    },
  ],
  gender: [
    {
      required: true,
      message: "请选择性别",
      trigger: "change",
    },
  ],
  birthday: [
    {
      required: true,
      message: "请选择出生年月",
      trigger: "change",
    },
  ],
  nativePlace: [
    {
      required: true,
      message: "请选择籍贯",
      trigger: "change",
    },
  ],
  nation: [
    {
      required: true,
      message: "请选择民族",
      trigger: "change",
    },
  ],
  idCard: [
    {
      required: true,
      message: "请输入身份证号",
      trigger: "blur",
    },
  ],
  politics: [
    {
      required: true,
      message: "请选择政治面貌",
      trigger: "change",
    },
  ],
  socialCard: [
    {
      required: true,
      message: "请输入社保卡号",
      trigger: "blur",
    },
  ],
  marriage: [
    {
      required: true,
      message: "请选择婚姻状况",
      trigger: "change",
    },
  ],
  eduLevel: [
    {
      required: true,
      message: "请选择受教育程度",
      trigger: "change",
    },
  ],
  education: [
    {
      required: true,
      message: "请选择最高学历",
      trigger: "change",
    },
  ],
  resident: [
    {
      required: true,
      message: "请输入户口所在地",
      trigger: "blur",
    },
  ],
  address: [
    {
      required: true,
      message: "请输入现居住地址",
      trigger: "blur",
    },
  ],
});
const data = reactive({
  nativePlacedata: [] as Array<string>,
  nationdata: [] as Array<string>,
  politicsdata: [] as Array<string>,
  eduLeveldata: [] as Array<string>,
});
// 表单验证
const submitForm = async () => {
  if (!ruleFormRef.value) return;
  return await ruleFormRef.value.validate().catch(() => {});
};
// 处理数据
const disposenation = () => {
  data.nativePlacedata = nativePlace.map((item: any) => item.name);
  data.nationdata = nation.map((item: any) => item.name);
  data.politicsdata = politics;
  data.eduLeveldata = eduLevel;
};
// 选择时间
const selecttime = (val: string) => {
  ruleForm.birthday = val;
};
onMounted(() => {
  disposenation();
});
// 暴露方法
defineExpose({
  submitForm,
});
</script>

<style lang="less" scoped>
.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.el-form {
  display: flex;
}

.el-form-item {
  width: 400px;
}

.demo-ruleForm-but {
  margin-left: 460px;

  .el-button {
    width: 100px;
    height: 40px;
  }
}

.el-input {
  height: 40px;
}

.el-select {
  height: 40px;

  :deep(.el-select__wrapper) {
    height: 100%;
  }
}
</style>
