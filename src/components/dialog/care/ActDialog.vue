<template>
  <el-dialog
    v-model="dialogVisible"
    title="院内详情"
    width="500"
    @close="close"
  >
    <el-form label-width="130px" label-position="left" style="max-width: 600px">
      <el-form-item
        v-for="item in states.elderly"
        :key="item.id"
        label="老人："
      >
        {{ item.elderlyName }}
      </el-form-item>
      <el-form-item label="精神慰籍内容：" class="formitem">
        <div class="content">
          {{ states.content }}
        </div>
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close">关闭</el-button>
      </div>
    </template>
  </el-dialog>
</template>

<script lang="ts" setup>
import { ref, onMounted, defineEmits, defineProps } from "vue";
import { PlayList } from "@/service/care/gooutApi";
const props = defineProps(["id"]);
const emit = defineEmits(["close"]);
const dialogVisible = ref(true);

// 关闭弹窗
const close = (close: boolean = false) => {
  emit("close", close);
};
const states = ref<any>([]);
const PlayListData = async () => {
  let res: any = await PlayList(props.id);
  console.log(res);
  if (res?.code == 10000) {
    Object.assign(states.value, res.data);
  }
};
onMounted(() => {
  PlayListData(); //获取单条院内活动
});
</script>
<style lang="less" scoped>
.content {
  width: 80%;
  white-space: normal;
}
.formitem {
  align-items: flex-start;
}
</style>
