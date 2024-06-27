<template>
  <el-dialog
    v-model="dialogVisible"
    title="新增/编辑地址"
    width="500"
    @close="close"
  >
    <el-form
      :model="form"
      label-position="left"
      label-width="100px"
      style="max-width: 600px"
    >
      <el-form-item label="地址名称：">
        <el-input v-model="form.name" @input="createQRCode" />
      </el-form-item>
      <el-form-item label="地址二维码：">
        <el-image
          v-if="codedata"
          :src="codedata"
          style="width: 80px; height: 80px"
        />
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="add"> 确认 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, reactive, ref, watch } from "vue";
import { addressadd, addressupdate } from "@/service/address/AddressApi";
import { uploadImage } from "@/service/upload/UploadApi";
import type { AddressAdd } from "@/service/address/AddressType";
import { dataURLtoFile } from "@/utils/utils";
import { ElMessage } from "element-plus";
// 二维码
import qrcode from "qrcode";

const emit = defineEmits(["close"]);
const dialogVisible = ref(true);
const upload = import.meta.env.VITE_BASE_URL;
const codedata = ref("");
const form = reactive<AddressAdd>({
  id: 0,
  name: "",
  qrcode: "",
});
const props = defineProps({
  data: {
    type: Object,
    default: () => {},
  },
});
// 数据回显
watch(
  () => props.data,
  (newval) => {
    if (newval) {
      console.log("newval", newval);
      if (newval?.id) {
        Object.assign(form, newval);
        codedata.value = upload + "/" + form.qrcode;
      }
    }
  },
  { immediate: true }
);

// 新增地址
const add = async () => {
  let res: any;
  form.qrcode = await uploadcode();
  if (!form.id) {
    res = await addressadd(form);
  } else {
    res = await addressupdate(form);
  }
  console.log("增加", res);
  if (res?.code === 10000) {
    ElMessage.success("操作成功");
    close(true);
  } else {
    ElMessage.error(res?.msg);
  }
};

// 上传二维码
const uploadcode = async () => {
  const url = dataURLtoFile(codedata.value, form.name);
  console.log("url", { file: url });
  let upload: any = await uploadImage(url);
  console.log("11111", upload);
  if (upload?.code === 10000) {
    return upload?.data?.url;
  }
};

// 关闭弹窗
const close = (close: boolean = false) => {
  emit("close", close);
};
// 生成二维码
const createQRCode = () => {
  if (form.name) {
    qrcode.toDataURL(form.name, function (err, url) {
      if (err) throw err;
      // console.log(url)
      codedata.value = url;
    });
  }
};
</script>
<style lang="less" scoped></style>
