<template>
  <el-dialog v-model="isdialog" title="查看详情" width="50%" @close="close">
    <el-form>
      <el-form-item>
        {{ data.list.title }}
      </el-form-item>
      <el-form-item>
        {{ data.list.content }}
      </el-form-item>
      <el-form-item>
        <div v-for="(item, index) in data.image" :key="index">
          <el-image :src="upload + '/' + item.file" fit="fill" />
        </div>
      </el-form-item>
      <el-form-item>
        {{ data.list.elderlyName }} {{ data.list.addTime }} 发布
      </el-form-item>
    </el-form>
    <template #footer>
      <div class="dialog-footer">
        <el-button @click="close(false)">取消</el-button>
        <el-button type="primary" @click="close(true)"> 确定 </el-button>
      </div>
    </template>
  </el-dialog>
</template>
<script lang="ts" setup>
import { ref, reactive, defineEmits, defineProps, onMounted } from "vue";
import { clothesget } from "@/service/care/ClothesApi";
const props = defineProps(["id"]);
const upload = import.meta.env.VITE_BASE_URL;
const data = reactive({
  list: [] as any,
  image: [] as any,
});

// 获取单挑数据
const getData = async () => {
  let id = props.id;
  if (id) {
    const res: any = await clothesget(id);
    console.log("单挑数据", res);
    if (res.code === 10000) {
      data.list = res.data;
      if (res.data.pictures) {
        data.image = res.data.pictures;
      }
    }
  }

  //
};
onMounted(() => {
  getData();
});

// 关闭弹窗
const isdialog = ref(true);
const emit = defineEmits(["close"]);
const close = (close: boolean = false) => {
  emit("close", close);
};
</script>
<style lang="less" scoped>
.el-image {
  margin-right: 10px;
  width: 150px;
  height: 100px;
}
</style>
