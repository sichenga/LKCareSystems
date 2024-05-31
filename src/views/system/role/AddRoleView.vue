<template>
  <!--新增角色  -->
  <el-form
    ref="ruleFormRef"
    style="max-width: 600px"
    :model="ruleForm"
    :rules="rules"
    label-width="auto"
    class="demo-ruleForm"
    :size="formSize"
    status-icon
    label-position="top"
  >
    <el-form-item label="角色名称" prop="name">
      <el-input v-model="ruleForm.name" placeholder="请输入角色名称" />
    </el-form-item>
    <el-form-item label="权限配置" prop="menuIds">
      <el-tree
        ref="treeRef"
        style="max-width: 600px"
        :data="data"
        show-checkbox
        :default-expand-all="false"
        node-key="id"
        :default-expanded-keys="ArrData"
        :default-checked-keys="ArrData"
        :props="defaultProps"
      />
    </el-form-item>
  </el-form>
  <div class="dialog-footer">
    <el-button @click="closeDialog">取消</el-button>
    <el-button type="primary" @click="addlist"> 确定 </el-button>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import type {
  ComponentSize,
  FormInstance,
  FormRules,
  ElTree,
} from "element-plus";
import { ElMessage } from "element-plus";
import { convertToTree } from "@/utils/treeUtils";
import { getList, Addroles, Rolesget } from "@/service/role/RoleApi";
import { useRouter, useRoute } from "vue-router";
const treeRef = ref<InstanceType<typeof ElTree>>();
const router = useRouter();
const route = useRoute();

const formSize = ref<ComponentSize>("default");
const ruleFormRef = ref<FormInstance>();
const ruleForm = reactive<any>({
  name: "",
  menuIds: [],
});

const ArrData: any = ref([]);

const rules = reactive<FormRules<any>>({
  name: [{ required: true, message: "姓名不能为空", trigger: "blur" }],
  menuIds: [
    {
      type: "array",
      required: true,
      message: "请选择权限",
      trigger: "change",
    },
  ],
});

const defaultProps = {
  children: "children",
  label: "name",
};

const data: any = ref([]);

const getlist = async () => {
  let res: any = await getList().catch(() => {});
  if (res.code == 10000) {
    data.value = convertToTree(res.data.list);
  }
};

const addlist = async () => {
  if (treeRef.value?.getCheckedKeys()) {
    ruleForm.menuIds = treeRef.value?.getCheckedKeys();
  }
  let res: any = await Addroles(ruleForm).catch(() => {});
  if (res.code == 10000) {
    let id = Number(route.query.id);
    if (id) {
      ElMessage.success("修改成功");
    } else {
      ElMessage.success("添加成功");
    }
    router.push("/dashboard/role");
  }
};

//编辑
const edit = async () => {
  let id = Number(route.query.id);
  if (id >= 0) {
    let res: any = await Rolesget(id).catch(() => {});
    if (res.code === 10000) {
      Object.assign(ruleForm, res.data);
      if (res.data.menuIds == null) {
        ArrData.value = [];
      } else {
        ArrData.value = res.data.menuIds;
      }
    }
  }
};

const closeDialog = () => {
  router.push("/system/role");
};

onMounted(() => {
  getlist(); //权限
  edit(); //编辑
});
</script>
<style lang="less" scoped>
.el-input {
  width: 300px;
}

.el-select {
  width: 300px;
}
</style>
