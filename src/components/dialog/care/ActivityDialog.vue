<template>
  <el-dialog
    v-model="dialogVisible"
    :title="porpos.id ? '修改院内活动' : '增加院内活动'"
    width="900"
    @close="close"
  >
    <OldSelectDialog
      v-if="diaVisible"
      @close="closes"
      :isMultiple="isMultiple"
      :isoperate="isoperate"
      @serve-list="serveList"
    />
    <el-form
      ref="ruleFormRef"
      style="max-width: 600px"
      :model="ruleForm"
      :rules="rules"
      label-width="auto"
      class="demo-ruleForm"
      status-icon
    >
      <el-form-item label="标题：" prop="title">
        <el-input v-model="ruleForm.title" />
      </el-form-item>
      <el-form-item label="分类：" prop="type" style="width: 410px">
        <el-select v-model="ruleForm.type" placeholder="请选择">
          <el-option
            v-for="item in TypeList"
            :key="item.id"
            :label="item.name"
            :value="item.id"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="老人：" prop="elderly">
        <!-- <el-input v-model="ruleForm.elderly" /> -->
        <span v-if="OldName.length" @click="oldAdd">
          {{ OldName.toString() }}
        </span>
        <el-button v-else type="primary" @click="oldAdd">选择老人</el-button>
      </el-form-item>
      <el-form-item label="精神慰藉内容：">
        <div class="Editor">
          <MyEditor @change="change" :content="content" />
        </div>
      </el-form-item>
      <el-form-item label="上传图片：" class="top">
        <UploadPictures
          @upload="upload"
          @upload-file="uploadFile"
          :files="files"
          :title="'选择文件'"
        />
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
import { ref, reactive, defineEmits, onMounted, defineProps } from "vue";
import type { FormInstance, FormRules } from "element-plus";
import { ElMessage } from "element-plus";
import MyEditor from "@/components/wangeditor/MyEditor.vue";
import { getPlayTypeList, AddPlayAdd, PlayList } from "@/service/care/gooutApi";
import UploadPictures from "@/components/upload/UploadImg.vue";
import type { AddplayList } from "@/service/care/gooutType";
import OldSelectDialog from "@/components/dialog/OldSelect/OldSelectDialog.vue";
const Image = import.meta.env.VITE_BASE_URL + "/";
const porpos = defineProps({
  id: {
    type: Number,
    default: 0,
  },
});

const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<AddplayList>({
  id: porpos.id,
  title: "",
  type: null,
  content: "",
  elderly: [],
  pictures: [],
});
//富文本编辑器
const change = (val: any) => {
  ruleForm.content = val;
};
const rules = reactive<FormRules<AddplayList>>({
  title: [
    {
      required: true,
      message: "请输入标题",
      trigger: "blur",
    },
  ],
  type: [
    {
      required: true,
      message: "请选择类型",
      trigger: "change",
    },
  ],
  elderly: [
    {
      required: true,
      message: "请选择老人",
      trigger: "change",
    },
  ],
});
const dialogVisible = ref(true);
const emit = defineEmits(["close"]);
// 关闭弹窗
const close = (close: boolean = false) => {
  emit("close", close);
};

//活动分类列表
const TypeList = ref<any>([]);
const getPlayType = async () => {
  let res: any = await getPlayTypeList().catch(() => {});
  if (res?.code == 10000) {
    TypeList.value = res.data.list;
  }
};
//选择老人
const diaVisible = ref(false);
const isMultiple = ref(false);
const isoperate = ref(true);
const oldAdd = () => {
  diaVisible.value = true;
  isMultiple.value = true;
  isoperate.value = false;
};
const closes = (val: any) => {
  diaVisible.value = val;
};

//图片

const upload = (val: any) => {
  console.log("图片", val);

  ruleForm.pictures.push({
    picture: val,
  });
};
// 删除图片
const uploadFile = (val: any) => {
  ruleForm.pictures = ruleForm.pictures.filter((item: any) =>
    val.name ? item.picture != val.name : item.picture != val?.response.data.url
  );
};
// 勾选老人的值
const OldName = ref<string[]>([]);
const serveList = (val: any) => {
  console.log(1111, val);
  OldName.value = [
    // ...OldName.value,
    ...val
      .filter((item: any) => !OldName.value.includes(item.name))
      .map((item: any) => item.name),
  ];

  ruleForm.elderly = val.map((item: any) => ({
    elderlyId: item.id,
  }));
};
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    let res: any;
    if (porpos.id) {
      res = await AddPlayAdd(ruleForm);
    } else {
      res = await AddPlayAdd(ruleForm);
    }
    if (res?.code == 10000) {
      emit("close", true);
      ElMessage.success(porpos.id ? "修改成功" : "添加成功");
    }
  }
};

//富文本编辑器回显
const content = ref("");
//获取单挑院内活动
const files = ref([]);
const getList = async () => {
  if (porpos.id) {
    let id = Number(porpos.id);
    let res: any = await PlayList(id);

    if (res?.code == 10000) {
      content.value = res.data.content;
      OldName.value = res.data.elderly.map((item: any) => item.elderlyName);
      files.value = res.data.pictures.map((item: any) => ({
        name: item.picture,
        url: Image + item.picture,
      }));
      Object.assign(ruleForm, res.data);
    }
  }
};

onMounted(async () => {
  await getPlayType(); //活动分类列表
  await getList(); //获取单挑院内活动
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}
:deep(.el-form-item) {
  align-items: flex-start;
}
.Editor {
  width: 800px;
  height: 400px;
}
.top {
  margin-top: 50px;
}
</style>
