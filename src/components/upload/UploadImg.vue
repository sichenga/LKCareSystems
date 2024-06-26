<template>
  <el-upload
    ref="upload"
    v-model:file-list="fileList"
    :action="action"
    :headers="headers"
    :limit="3"
    :on-exceed="handleExceed"
    :on-remove="handleRemove"
    :on-success="handleAvatarSuccess"
    :show-file-list="props.showlist"
    class="upload-demo"
  >
    <template #trigger>
      <el-button :text="texts" type="primary">{{ props.title }}</el-button>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import type { UploadInstance, UploadProps, UploadRawFile } from "element-plus";
import { genFileId } from "element-plus";
import { useUserStore } from "@/store";
import { TOKEN_KEY } from "@/enums/CacheEnum";

const action = import.meta.env.VITE_BASE_UPLOAD_ADD || "";

const emits = defineEmits(["upload", "uploadFile"]);
const userStore = useUserStore();
const headers = {
  Authorization: localStorage.getItem(TOKEN_KEY) || "",
};
const props = defineProps({
  showlist: {
    type: Boolean,
    default: true,
  },
  title: {
    type: String,
    default: "上传图片",
  },
  files: {
    type: Object,
    default: () => {},
  },
  texts: {
    type: Boolean,
    default: false,
  },
});
const fileList = ref<any>([]);
watch(
  props,
  (val) => {
    console.log("图片回显", val.files);
    fileList.value = val.files;
  },
  { deep: true }
);
const upload = ref<UploadInstance>();
// 替换文件
const handleExceed: UploadProps["onExceed"] = (files) => {
  upload.value!.clearFiles();
  const file = files[0] as UploadRawFile;
  file.uid = genFileId();
  upload.value!.handleStart(file);
  // emits('upload', files)
  upload.value?.submit();
};
// 传递数据
const handleAvatarSuccess: UploadProps["onSuccess"] = (response) => {
  console.log("上传图片", response);
  if (response?.code === 10000) {
    emits("upload", response.data?.url);
  }
};
// 删除
const handleRemove: UploadProps["onRemove"] = (uploadFile: any) => {
  console.log("删除图片", uploadFile);

  emits("uploadFile", uploadFile);
};

// const
</script>
<style lang="less" scoped>
.avatar {
  width: 100px;
  height: 100px;
  margin-top: 60px;
}
.el-upload {
  align-items: center;
}
</style>
