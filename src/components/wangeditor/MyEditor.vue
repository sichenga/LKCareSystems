<template>
  <div style="border: 1px solid #ccc">
    <Toolbar
      :defaultConfig="toolbarConfig"
      :editor="editorRef"
      :mode="mode"
      style="height: 120px; border-bottom: 1px solid #ccc"
    />
    <Editor
      v-model="valueHtml"
      :defaultConfig="editorConfig"
      :mode="mode"
      style="height: 300px; overflow-y: hidden"
      @on-change="change"
      @on-created="handleCreated"
    />
  </div>
</template>
<script lang="ts" setup>
import "@wangeditor/editor/dist/css/style.css"; // 引入 css
import {
  onBeforeUnmount,
  ref,
  shallowRef,
  defineEmits,
  defineProps,
  watch,
} from "vue";
import { Editor, Toolbar } from "@wangeditor/editor-for-vue";
import type { IEditorConfig } from "@wangeditor/editor";
import { useUserStore } from "@/store";
import { TOKEN_KEY } from "@/enums/CacheEnum";

const userstore = useUserStore();
const props = defineProps({
  content: {
    type: String,
    default: "",
  },
});

watch(
  () => props.content,
  (newValue: any) => {
    console.log(newValue);
    if (newValue) {
      valueHtml.value = newValue;
    }
  }
);
const emit = defineEmits(["change"]);
const mode = "default"; // 或 'simple'
// 编辑器实例，必须用 shallowRef
const editorRef = shallowRef();
// 内容 HTML
const valueHtml = ref("<p></p>");
const toolbarConfig = {};
const editorConfig: Partial<IEditorConfig> = {
  placeholder: "请输入内容...",
  MENU_CONF: {
    uploadImage: {
      server: import.meta.env.VITE_BASE_UPLOAD_ADD,
      fieldName: "file",
      headers: {
        Authorization: localStorage.getItem(TOKEN_KEY) || "",
      },
      uploadImgHeaders: {
        Accept: "text/x-json",
      },
      customInsert: (res: any, insertFn: any) => {
        console.log(res);
        if (res?.code === 10000) {
          const img = import.meta.env.VITE_BASE_URL + res.data;
          insertFn(img);
        }
      },
    },
  },
};
// 组件销毁时，也及时销毁编辑器
onBeforeUnmount(() => {
  const editor = editorRef.value;
  if (editor == null) return;
  editor.destroy();
});

const handleCreated = (editor: any) => {
  editorRef.value = editor; // 记录 editor 实例，重要！
};
const change = () => {
  // console.log(valueHtml.value);
  emit("change", valueHtml.value);
};
</script>
<style lang="less" scoped>
// @import '@wangeditor/editor/dist/css/style.css'
</style>
