import { createApp } from "vue";
import App from "./App.vue";
import router from "@/router";
import { setupStore } from "@/store";
import { setupDirective } from "@/directive";
import "default-passive-events";
import { setupElIcons, setupI18n, setupPermission } from "@/plugins";
// 本地SVG图标
import "virtual:svg-icons-register";
import "@/utils/browserPatch";
// 样式
import "element-plus/theme-chalk/dark/css-vars.css";
import "element-plus/dist/index.css";
import "@/styles/index.scss";
import "uno.css";
import "animate.css";

const app = createApp(App);
// 全局注册 自定义指令(directive)
setupDirective(app);
// 全局注册 状态管理(store)
setupStore(app);
// 全局注册Element-plus图标
setupElIcons(app);
// 国际化
setupI18n(app);
// 注册动态路由
setupPermission();
app.use(router).mount("#app");
