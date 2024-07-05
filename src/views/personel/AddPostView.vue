<template>
  <!-- 新增岗位 -->
  <div class="app-container">
    <div class="box">
      <el-form
        ref="ruleFormRef"
        :model="ruleForm"
        :rules="rules"
        :size="formSize"
        class="demo-ruleForm"
        label-width="auto"
        status-icon
        style="max-width: 600px"
      >
        <el-form-item label="岗位名称:" prop="name">
          <el-input v-model="ruleForm.name" placeholder="请输入" />
        </el-form-item>
        <el-form-item class="tree" label="权限配置:" prop="name">
          <el-scrollbar height="350px">
            <el-tree
              ref="treeRef"
              :data="data.tableData"
              :expand-on-click-node="false"
              :props="{ label: 'name', children: 'children' }"
              node-key="id"
              show-checkbox
              style="max-width: 600px"
            />
          </el-scrollbar>
        </el-form-item>
      </el-form>
    </div>
    <div class="button">
      <el-button @click="resetForm()">取消</el-button>
      <el-button type="primary" @click="submitForm(ruleFormRef)">
        确定
      </el-button>
    </div>
  </div>
</template>

<script lang="ts" setup>
import { onMounted, reactive, ref, watch } from "vue";
import type { ComponentSize, FormInstance, FormRules } from "element-plus";
import { ElMessage, ElTree } from "element-plus";
import { Addroles, getList, Rolesget } from "@/service/role/RoleApi";
import type { Addrole, RoleList } from "@/service/role/Roletype";
import { useRoute, useRouter } from "vue-router";
import { TreeData, convertToTree } from "@/utils/utils";

const router = useRouter();
const route = useRoute();
const treeRef = ref<InstanceType<typeof ElTree>>();
const data = reactive({
  tableData: [] as Array<RoleList>,
});

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<Addrole>({
  id: 0,
  name: "",
  menuIds: [],
});
const rules = reactive<FormRules<Addrole>>({
  name: [
    {
      required: true,
      message: "请输入岗位名称",
      trigger: "blur",
    },
  ],
  menuIds: [
    {
      required: true,
      message: "请选择权限",
      trigger: "change",
    },
  ],
});

// 数据回显
watch(
  () => route.params?.id,
  async (newval) => {
    console.log(newval);
    if (newval) {
      let res: any = await Rolesget(Number(newval)).catch(() => {});
      console.log("编辑", res);
      if (res.code === 10000) {
        Object.assign(ruleForm, res.data);
        treeRef.value && treeRef.value.setCheckedKeys(res.data.menuIds);
      }
    }
  },
  { immediate: true }
);
// 提交表单
const submitForm = async (formEl: FormInstance | undefined) => {
  // router.push('/dashboard/post')
  if (!formEl) return;
  const valid = await formEl.validate();
  if (valid) {
    ruleForm.menuIds =
      treeRef.value && (treeRef.value?.getCheckedKeys() as any);
    let res: any = await Addroles(ruleForm).catch(() => {});
    console.log("增加岗位", res);
    if (res?.code == 10000) {
      ElMessage.success((ruleForm.id ? "修改" : "增加") + "岗位成功");
      resetForm();
    } else {
      ElMessage.error(res.msg);
    }
  }
};
// 返回 || 取消
const resetForm = () => {
  router.push("/personel/position");
};

// 权限列表
const getlist = async () => {
  let res: any = await getList().catch(() => {});
  console.log("权限", res);
  if (res?.code == 10000) {
    data.tableData = convertToTree(res.data.list);
  }
};
onMounted(() => {
  getlist();
});
</script>

<style lang="less" scoped>
.box {
  background-color: #fff;
  padding: 20px;
}

.el-form-item {
  width: 400px;
}

.button {
  text-align: center;
  margin-top: 40px;
}

.avatar-uploader .avatar {
  width: 178px;
  height: 178px;
  display: block;
}

.tree {
  align-items: flex-start;
}
</style>
