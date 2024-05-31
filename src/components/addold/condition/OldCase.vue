<template>
  <div>
    <div class="size"><span>▋</span> 病史介绍</div>
    <div>
      <div class="titles">现病史</div>
      <div class="checkbox">
        <el-checkbox-group v-model="ruleForm.health.oldillness">
          <el-checkbox
            v-for="item in states.diseasedata"
            :key="item.id"
            :value="item.name"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
      <div class="titles">既往病史</div>
      <div class="checkbox">
        <el-checkbox-group v-model="ruleForm.health.nowillness">
          <el-checkbox
            v-for="item in states.diseasedata"
            :key="item.id"
            :value="item.name"
          >
            {{ item.name }}
          </el-checkbox>
        </el-checkbox-group>
      </div>
    </div>
    <div>
      <div class="titles">其他疾病</div>
      <el-input v-model="ruleForm.health.otherillness" type="textarea" />
    </div>
  </div>
</template>
<script lang="ts" setup>
import { reactive, onMounted, inject } from "vue";
import { getDiseaseList } from "@/service/old/OldApi";
import type { AddElderlyRequest } from "@/service/old/OldType";
const ruleForm = inject<AddElderlyRequest>("ruleForm")!;
const states: any = reactive({
  diseasedata: [],
});
const getDisease = async () => {
  const res: any = await getDiseaseList();
  console.log(res);
  if (res?.code === 10000) {
    states.diseasedata = res.data.list;
  }
};
onMounted(() => {
  getDisease();
});
</script>
<style lang="less" scoped>
.size {
  color: #666666;
  font-size: 14px;

  span {
    color: #409eff;
  }
}

.titles {
  margin-top: 20px;
}

.checkbox {
  width: 680px;
  margin: 10px 0 20px 0;
}
</style>
