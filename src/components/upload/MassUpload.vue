<template>
  <el-upload
    v-model:file-list="fileList"
    :limit="props.limit"
    :action="action"
    :headers="headers"
    list-type="picture-card"
    :on-preview="handlePictureCardPreview"
    :on-remove="handleRemove"
    :on-success="handleSuccess"
  >
    <el-icon>
      <Plus />
    </el-icon>
    <template #tip>
      <div class="el-upload__tip">(可上传{{ props.limit }}张图片)</div>
    </template>
  </el-upload>
  <el-dialog v-model="dialogVisible" v-if="props.delete">
    <img w-full :src="dialogImageUrl" alt="Preview Image" />
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, defineEmits, watch, defineProps } from "vue";
import type { PropType } from "vue";
import { Plus } from "@element-plus/icons-vue";

const action = import.meta.env.VITE_BASE_UPLOAD_ADD || "";

const emit = defineEmits(["upload", "uploadrem"]);
const headers = {
  Authorization: sessionStorage.getItem("token") || "",
};
import type { UploadProps, UploadUserFile } from "element-plus";
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
});
// 数据回显
const fileList = ref<UploadUserFile[]>([]);
watch(
  () => props.showlist,
  (newval: UploadUserFile[]) => {
    console.log(123);

    console.log(4444, newval);

    fileList.value = newval;
  },
  { deep: true, immediate: true }
);

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
const dialogImageUrl = ref("");
const dialogVisible = ref(false);
// 移出图片
const handleRemove: UploadProps["onRemove"] = (uploadFile: any) => {
  console.log(777, uploadFile);
  emit("uploadrem", uploadFile?.response?.data ?? uploadFile?.name);
};

const handleSuccess: UploadProps["onSuccess"] = (uploadFile: any) => {
  console.log(777, uploadFile);
  if (uploadFile.code === 10000) {
    emit("upload", uploadFile.data);
  }
};

const handlePictureCardPreview: UploadProps["onPreview"] = (
  uploadFile: any
) => {
  console.log(111111111, uploadFile);

  dialogImageUrl.value = uploadFile.url!;
  dialogVisible.value = false;
};
</script>
<style lang="less" scoped></style>
