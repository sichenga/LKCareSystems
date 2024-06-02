<template>
  <el-upload
    v-model:file-list="fileList"
    class="upload-demo"
    :action="action"
    :headers="headers"
    :limit="props.limit"
    :on-success="handleSuccess"
    :on-remove="handleRemove"
    list-type="picture"
    :show-file-list="props.showfile"
  >
    <el-button type="primary">{{ props.text }}</el-button>
    <template #tip>
      <div class="el-upload__tip" v-if="istip">
        可以上传{{ props.limit }}张图片
      </div>
    </template>
  </el-upload>
</template>
<script lang="ts" setup>
import { ref, defineEmits, watch, defineProps, watchEffect } from "vue";
import type { UploadProps, UploadUserFile } from "element-plus";
import type { PropType } from "vue";
const emit = defineEmits(["upload", "uploadrem", "isdel"]);
const action = import.meta.env.VITE_BASE_UPLOAD_ADD || "";
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
  istip: {
    type: Boolean,
    default: true,
  },
  text: {
    type: String,
    default: "上传图片",
  },
  showfile: {
    type: Boolean,
    default: true,
  },
});
const fileList = ref<UploadUserFile[]>([]);
// 数据回显
// watch(() => props.showlist, (newval: UploadUserFile[]) => {
//   console.log(4444, newval);
//   if (newval) {
//     fileList.value = newval
//   }
// },)
watchEffect(() => {
  if (props.showlist.length > 0) {
    console.log("图片上传回显", props.showlist);
    fileList.value = props.showlist;
  }
});
// 是否清除数据
watch(
  () => props.delete,
  (newval: boolean) => {
    console.log(6666, newval);
    if (newval == false) {
      fileList.value = [];
    }
  },
  { deep: true }
);

// 配置头部
const headers = {
  Authorization: sessionStorage.getItem("token") || "",
};
// 移除图片
const handleRemove: UploadProps["onRemove"] = (uploadFile: any) => {
  console.log("图片", uploadFile);
  emit("uploadrem", uploadFile?.response?.data ?? uploadFile.name);
};
// 上传成功
const handleSuccess: UploadProps["onPreview"] = (file: any) => {
  console.log(file);
  if (file?.code == 10000) {
    emit("upload", file.data);
  }
};
</script>
<style lang="less" scoped></style>
