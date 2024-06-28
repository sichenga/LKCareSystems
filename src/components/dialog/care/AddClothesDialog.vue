<template>
  <el-dialog
    v-model="dialogVisible"
    :title="ruleForm.id == 0 ? '添加洗衣错衣' : '编辑洗衣错衣'"
    width="500"
    @close="close"
  >
    <OldDialog v-if="idOld" @closes="closes" @id="oldid" />
    <el-form
      ref="ruleFormRef"
      :model="ruleForm"
      :rules="rules"
      :size="formSize"
      class="demo-ruleForm"
      label-position="right"
      label-width="auto"
      status-icon
      style="max-width: 600px"
    >
      <el-form-item label="老人姓名:" prop="elderlyId">
        <el-button text bg :type="OldName ? '' : 'primary'" @click="select">{{
          OldName ? OldName : "选择老人"
        }}</el-button>
      </el-form-item>

      <el-form-item label="标题:" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="类型:" prop="type">
        <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option label="缺衣:" value="缺衣" />
          <el-option label="错衣:" value="错衣" />
        </el-select>
      </el-form-item>
      <el-form-item label="状态:" prop="state">
        <el-select v-model="ruleForm.state" placeholder="请选择">
          <el-option label="未解决:" value="未解决" />
          <el-option label="已解决:" value="已解决" />
        </el-select>
      </el-form-item>
      <el-form-item label="内容:" prop="content">
        <el-input v-model="ruleForm.content" type="textarea" />
      </el-form-item>
      <el-form-item>
        <!-- 图片上传 -->
        <div style="margin-left: 80px">
          <UploadPictures
            :limit="3"
            :showlist="getUploadPictures"
            @upload="pictureupload"
            @uploadrem="picturerem"
          />
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="submitForm(ruleFormRef)">
          确定
        </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, onMounted, reactive, ref } from "vue";
import OldDialog from "./OldDialog.vue";
import type {
  ComponentSize,
  FormInstance,
  FormRules,
  UploadUserFile,
} from "element-plus";
import { ElMessage } from "element-plus";
import { getElderly } from "@/service/old/OldApi";
import UploadPictures from "@/components/upload/UploadPictures.vue";
import {
  clothesAdd,
  clothesget,
  clothesUpdate,
} from "@/service/care/ClothesApi";
import type { ClothesAddParams } from "@/service/care/ClothesType";

const upload = import.meta.env.VITE_BASE_URL;
const props = defineProps(["id"]);
const getUploadPictures = ref<UploadUserFile[]>([]);
const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<ClothesAddParams>({
  id: props.id,
  elderlyId: null,
  content: "",
  title: "",
  type: "",
  state: "",
  pictures: [],
});
const rules = reactive<FormRules<ClothesAddParams>>({
  title: [{ required: true, message: "请输入标题", trigger: "blur" }],
  type: [{ required: true, message: "请选择类型", trigger: "blur" }],
  state: [{ required: true, message: "请选择状态", trigger: "blur" }],
  content: [{ required: true, message: "请输入内容", trigger: "blur" }],
  elderlyId: [{ required: true, message: "请选择老人", trigger: "blur" }],
});

// 提交
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  await formEl.validate(async (valid, fields) => {
    if (valid) {
      if (ruleForm.id === 0) {
        const res: any = await clothesAdd(ruleForm);
        if (res.code == 10000) {
          ElMessage.success("添加成功");
          close(true);
        } else {
          ElMessage.error("添加失败");
        }
      } else {
        const res: any = await clothesUpdate(ruleForm);
        if (res.code == 10000) {
          ElMessage.success("修改成功");
          close(true);
        } else {
          ElMessage.error("修改成功");
        }
      }
    } else {
      console.log("error submit!", fields);
    }
  });
};

// 增加图片
const pictureupload = (val: any) => {
  ruleForm.pictures.push({ file: val.url });
  console.log(ruleForm);
};

// 移除图片
const picturerem = (val: any) => {
  const hasFile = ruleForm.pictures.some((item, index) => {
    console.log(item.file);
    console.log(val);
    if (item.file == val.url) {
      ruleForm.pictures.splice(index, 1);
      return true;
    } else if (item.file == val) {
      ruleForm.pictures.splice(index, 1);
      return true;
    }
    return false;
  });
  if (!hasFile) {
    console.log("文件未找到，无法移除");
  }
  console.log(ruleForm);
};
// 数据回显
const getData = async () => {
  let id = props.id;
  if (id) {
    const res: any = await clothesget(id);
    if (res.code == 10000) {
      OldName.value = res.data.elderlyName;
      Object.assign(ruleForm, res.data);
      console.log("单挑数据", res);
      if (ruleForm.pictures) {
        getUploadPictures.value = res.data.pictures.map((item: any) => {
          return {
            url: upload + "/" + item.file,
            name: item.file,
          };
        });
      }
    }
  }
};
const listold = async (id: any) => {
  console.log(id);
  const res = await getElderly(id);
  console.log("单挑老人", res);
};

onMounted(() => {
  getData();
});

// 选择老人
const idOld = ref(false);
const select = () => {
  idOld.value = true;
};

// 老人id
const OldName = ref("");
const oldid = async (id: number) => {
  console.log(id);
  if (id) {
    let res: any = await getElderly(id);
    console.log(res);
    if (res?.code == 10000) {
      OldName.value = res.data.name;
    }
    ruleForm.elderlyId = id;
    ElMessage.success("选择老人成功");
  }
};

// 关闭弹窗
const closes = (val: boolean) => {
  idOld.value = val;
};

// 弹出框
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>
<style lang="less" scoped>
.el-form-item {
  width: 350px;
}
</style>
