<template>
  <el-upload
    v-model:file-list="fileList"
    :action="action"
    :before-remove="beforeRemove"
    :headers="headers"
    :limit="limit"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
    class="upload-demo"
    multiple
  >
    <el-button type="primary">{{ props.text }}</el-button>
  </el-upload>
</template>
<script lang="ts" setup>
import type { PropType } from "vue";
import { defineEmits, defineProps, ref, watch } from "vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import { ElMessage, ElMessageBox } from "element-plus";
import { useUserStore } from "@/store";

const emit = defineEmits(["upload", "uploadrem"]);
const userStore = useUserStore();
const action = import.meta.env.VITE_BASE_UPLOAD_ADD || "";
const headers = {
  Authorization: userStore.token || "",
};
const props = defineProps({
  showlist: {
    type: Array as PropType<UploadUserFile[]>,
    default: () => [],
  },
  limit: {
    type: Number,
    default: 1,
  },
  delete: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: "上传视频",
  },
});
// 数据回显
watch(
  () => props.showlist,
  (newval: UploadUserFile[]) => {
    console.log("文件上传", newval);

    fileList.value = newval;
  },
  { deep: true }
);
// 是否清除数据
watch(
  () => props.delete,
  (newval: boolean) => {
    console.log(6666, newval);
    if (!newval) {
      fileList.value = [];
    }
  },
  { deep: true }
);

const fileList = ref<UploadUserFile[]>([]);
// 移除视频
const handleRemove: UploadProps["onRemove"] = (file: any) => {
  console.log(66666, file);
  emit("uploadrem", file?.response?.data ?? file?.name);
};

const handleSuccess: UploadProps["onPreview"] = (uploadFile: any) => {
  console.log(1111, uploadFile);
  if (uploadFile.code === 10000) {
    emit("upload", uploadFile.data);
  }
};

const handleExceed: UploadProps["onExceed"] = (
  files: any,
  uploadFiles: any
) => {
  ElMessage.warning(
    `The limit is 3, you selected ${files.length} files this time, add up to ${
      files.length + uploadFiles.length
    } totally`
  );
};

const beforeRemove: UploadProps["beforeRemove"] = (uploadFile: any) => {
  return ElMessageBox.confirm(`是否删除 ${uploadFile.name} ?`).then(
    () => true,
    () => false
  );
};
</script>
<style lang="less" scoped></style>
