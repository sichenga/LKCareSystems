<template>
  <!-- dialog写在market文件夹下 -->
  <!-- 投诉建议详情 -->
  <div class="app-container">
    <el-card style="max-width: 100%">
    <div class="header"><span>▋</span> 投诉建议信息</div>
    <div class="complaint-info">
      <ul>
        <li><strong>标题:</strong> <span>食堂的饭菜没有营养</span></li>
        <li><strong>状态:</strong> <span>待处理</span></li>
        <li><strong>投诉反馈渠道:</strong> <span class="tel">电话</span></li>
        <li><strong>投诉人:</strong><span class="username"> 张三丰</span></li>
        <li>
          <strong>投诉时间:</strong> <span class="r">2020-02-02 15:00</span>
        </li>
        <li><strong>关联老人:</strong><span class="r"> 张武</span></li>
      </ul>
    </div>
    <div class="suggest">
      <div class="content">
        <span>投诉建议内容</span>
      </div>
      <div class="info">
        <div class="title">如何用更好的方式去解决</div>
        <div class="imgs">
          <div class="img">
            <img src="../../assets/image/1000.jpg" alt="" />
          </div>
          <div class="img">
            <img src="../../assets/image/1000.jpg" alt="" />
          </div>
          <div class="img">
            <img src="../../assets/image/1000.jpg" alt="" />
          </div>
        </div>
      </div>
    </div>
    <div class="headers"><span>▋</span> 处理日志</div>
    <div style=" max-width: 600px;height: 300px">
      <el-steps direction="vertical" :active="1">
        <el-step title="Step 1" />
        <el-step title="Step 2" />
        <el-step title="Step 3" />
      </el-steps>
    </div>
  </el-card>
  </div>
  
</template>

<script lang="ts" setup></script>

<style lang="less" scoped>
.header {
  height: 80px;

  span {
    color: #529bfd;
    line-height: 80px;
  }
}

.complaint-info ul {
  list-style: none;
  padding: 0;
}

.complaint-info ul li {
  margin-bottom: 20px;
}

.complaint-info ul li span {
  padding-left: 100px;
}

.complaint-info ul li .tel {
  padding-left: 40px;
}

.complaint-info ul li .username {
  padding-left: 80px;
}

.complaint-info ul li .r {
  padding-left: 65px;
}

.suggest {
  display: flex;

  .content {
    width: 100px;
  }

  .info {
    height: 80px;
    width: 100%;
    margin-left: 40px;

    .title {
      margin-bottom: 10px;
    }

    .imgs {
      height: 80px;
      display: flex;

      .img {
        width: 70px;
        height: 70px;
        margin-right: 20px;

        img {
          width: 70px;
          height: 70px;
        }
      }
    }
  }
}

.headers {
  margin-top: 50px;
  height: 80px;

  span {
    color: #529bfd;
    line-height: 80px;
  }
}
</style>
