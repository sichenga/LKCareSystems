<template>
  <div class="title">
    <span v-if="!apperStore.statechange">{{ istype }}</span>
    <el-image v-else style="width: 80px; height: 50px" :src="url" />
  </div>
  <el-menu
    class="el-menu-vertical-demo"
    :collapse="apperStore.statechange"
    :collapse-transition="false"
    background-color="#333333"
    text-color="#ccc"
    active-text-color="#fff"
    :default-active="$route.fullPath"
    router
  >
    <el-menu-item index="/home" v-if="userStore.model.type !== 3">
      <el-icon>
        <i class="iconfont icon"></i>
        <House />
      </el-icon>
      <template #title>首页</template>
    </el-menu-item>
    <el-sub-menu
      :index="index + ''"
      v-for="(item, index) in leftmenu"
      :key="index"
    >
      <template #title>
        <i :class="{ iconfont: true, [item.icon]: true }"></i>
        <span>{{ item.name }}</span>
      </template>
      <el-menu-item-group>
        <el-menu-item
          v-for="(chym, chindex) in item.children"
          :key="chindex + ''"
          :index="'/' + item.url + '/' + chym.url"
        >
          <i :class="{ iconfont: true, [chym.icon]: true }"></i>
          {{ chym.name }}
        </el-menu-item>
      </el-menu-item-group>
    </el-sub-menu>
  </el-menu>
</template>
<script lang="ts" setup>
import { ref, onMounted, computed } from "vue";
import { House } from "@element-plus/icons-vue";
import type { Permission } from "@/Type/pinia/user";
import { homelogin } from "@/utils/images";
import { useApperStore, useUserStore } from "@/stores";

const userStore = useUserStore();
const apperStore = useApperStore();
const url = homelogin;
const leftmenu = ref<Array<Permission>>([]);
// 左侧菜单
const getmenu = () => {
  let menu: Array<Permission> = userStore.auth;
  console.log(menu);
  leftmenu.value = menu.map((item: any) => {
    return {
      ...item,
      children: item.children.filter(
        (fil: any) => fil.isButton === 0 && fil.url
      ),
    };
  });
};
onMounted(() => {
  getmenu();
});

// 判断登录端
const istype = computed(() => {
  if (userStore.model.type == 1) {
    return "运营端";
  } else if (userStore.model.type == 2) {
    return "机构中心端";
  } else {
    return "机构端";
  }
});
</script>
<style lang="less" scoped>
@import url("@/assets/leftMenu_icon/iconfont.css");
@import url("@/assets/leftmenu_icon2/iconfont.css");

.title {
  width: 100%;
  height: 60px;
  background-color: #1b2a3f;
  font-size: 18px;
  text-align: center;
  line-height: 60px;
  color: #fff;

  span {
    font-weight: bold;
  }
}

@keyframes hide {
  from {
    width: 90px;
    filter: blur(3px);
  }

  to {
    width: 180px;
    filter: blur(5px);
  }
}

:deep(.el-menu-item-group__title) {
  padding: 0;
}

.el-menu--collapse {
  width: 90px !important;
  :deep(.el-sub-menu__title) {
    justify-content: center;
  }
  //animation: hide 0.5s linear !important;
}

.el-menu {
  width: 100%;
  border-right: none;
}

.iconfont {
  margin-right: 5px;
}
</style>
