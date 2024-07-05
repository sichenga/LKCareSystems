<template>
  <el-upload
    :action="action"
    :headers="headers"
    :on-success="handleAvatarSuccess"
    :show-file-list="false"
    :style="style"
    class="avatar-uploader"
  >
    <img v-if="imageUrl" :src="ImageUrls + imageUrl" alt="" class="avatar" />
    <el-icon v-else class="avatar-uploader-icon">
      <Plus />
    </el-icon>
  </el-upload>
</template>
<script lang="ts" setup>
import { defineEmits, defineProps, ref, watch } from "vue";
import { Plus } from "@element-plus/icons-vue";
import type { UploadProps } from "element-plus";
const imageUrl = ref("");
const props = defineProps({
  style: {
    type: Object,
    default: () => {
      return {
        width: "65px",
        height: "65px",
      };
    },
  },
  editdata: {
    type: String,
    default: "",
  },
});
console.log(props.style);
// 数据回显
watch(
  () => props.editdata,
  (newval) => {
    if (newval) {
      imageUrl.value = newval;
    }
  },
  { immediate: true }
);
const action = import.meta.env.VITE_BASE_UPLOAD_ADD || "";
const ImageUrls = import.meta.env.VITE_BASE_URL + "/" || "";
const emit = defineEmits(["upload", "uploadrem"]);

const headers = {
  Authorization: sessionStorage.getItem("token") || "",
};

const handleAvatarSuccess: UploadProps["onSuccess"] = (
  response,
  uploadFile
) => {
  console.log("头像", response, uploadFile);
  if (response.code == 10000) {
    imageUrl.value = response.data.url;
    emit("upload", response.data.url);
  }
};
</script>

<style scoped>
.avatar-uploader .avatar {
  display: block;
  width: 100%;
  height: 100%;
}
</style>

<style>
.avatar-uploader .el-upload {
  position: relative;
  overflow: hidden;
  cursor: pointer;
  border: 1px dashed var(--el-border-color);
  border-radius: 6px;
  transition: var(--el-transition-duration-fast);
}

.avatar-uploader .el-upload:hover {
  border-color: var(--el-color-primary);
}

.el-upload {
  width: 100%;
  height: 100%;
}
</style>
