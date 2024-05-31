<template>
  <div>
    <el-card>
      <!-- 预定详情 -->
      <div class="user_content">
        <!-- 头像 -->
        <div class="form">
          <el-image
            style=" width: 50px; height: 50px;margin-top: 5px"
            :src="imageUrl"
          />
          <el-form
            label-width="120px"
            label-position="left"
            style="max-width: 600px; margin-left: 30px"
          >
            <div class="box">
              <div>
                <el-form-item label="老人姓名："
                  >{{ data.list.elderlyName }}
                </el-form-item>
                <el-form-item label="身份证/护照号：">{{
                  data.list.elderlyIdCard
                }}</el-form-item>
                <el-form-item label="床位号：">{{
                  data.list.begName
                }}</el-form-item>
              </div>
            </div>
          </el-form>
        </div>
        <div>
          <h2>预定待提交</h2>
        </div>
      </div>
    </el-card>
    <el-card style="margin-top: 15px">
      <div class="title">
        <div><i>▋</i> 预定信息</div>
      </div>
      <el-form
        label-position="left"
        label-width="auto"
        style="max-width: 600px; margin-left: 40px"
      >
        <el-form-item label="预定人姓名：">
          {{ data.list.name }}
        </el-form-item>
        <el-form-item label="预定人电话：">
          {{ data.list.mobile }}
        </el-form-item>
        <el-form-item label="与老人关系：">
          {{ data.list.relation }}
        </el-form-item>
        <el-form-item label="预定床位：">
          {{ data.list.begName }}
        </el-form-item>
        <el-form-item label="开始日期：">
          {{ data.list.startDate }}
        </el-form-item>
        <el-form-item label="预定时长（月）：">
          {{ data.list.addTime }}
        </el-form-item>
        <el-form-item label="定金应收：">
          {{ data.list.amount }}
        </el-form-item>
      </el-form>
      <div class="title">
        <div><i>▋</i> 预定协议</div>
      </div>
      <span v-for="(item, index) in url" :key="index" style="">
        <el-image
          style="width: 150px; height: 200px; margin-left: 40px"
          :src="upload + '/' + item.file"
          fit="fill"
        />
      </span>
      <div style="margin-top: 20px; text-align: center">
        <el-button @click="back">返回</el-button>
      </div>
    </el-card>
  </div>
</template>
<script lang="ts" setup>
import { ref, reactive, onMounted } from "vue";
import { reservationget } from "@/service/market/ReserveApi";
import { useRouter, useRoute } from "vue-router";
const router = useRouter();
const route = useRoute();
const upload = import.meta.env.VITE_BASE_URL;
const imageUrl = ref("");
const url: any = ref([]);
const data = reactive({
  list: [] as any,
});
//获取单条数据
const getData = async () => {
  const id: any = route.params.id;
  if (id) {
    const res: any = await reservationget(id);
    console.log("单条数据", res);
    if (res.code == 10000) {
      data.list = res.data;
      imageUrl.value = upload + "/" + res.data.elderlyPhoto;
      url.value = res.data.files;
      console.log(333, url.value);
    }
  }
};
onMounted(() => {
  getData();
});

// 返回
const back = () => {
  router.push("/market/reserve");
};
</script>
<style lang="less" scoped>
.user_content {
  display: flex;
  justify-content: space-between;

  .form {
    display: flex;

    form {
      margin-left: 30px;
    }
  }

  h2 {
    margin-top: 50px;
    margin-right: 30px;
  }
}

.title {
  margin-left: 40px;
  margin-bottom: 30px;

  i {
    font-style: normal;
    color: #409eff;
  }
}
</style>
