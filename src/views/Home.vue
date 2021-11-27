<template>
  <el-container>
    <el-header
      ><span>电商后台管理系统</span>
      <el-button @click="quit" type="info">退出</el-button></el-header
    >
    <el-container>
      <el-aside width="200px">
        <el-menu
          :default-active="dact"
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#409EFF"
          :unique-opened="isopen"
          :router="isrouter"
          :default-openeds="dopen"
        >
          <!-- 一级菜单 -->
          <el-submenu
            v-for="item in menus"
            :key="item.id"
            :index="item.id + ''"
          >
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>{{ item.authName }}</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item
              v-for="ite in item.children"
              :key="ite.id"
              :index="ite.id.toString()"
              :route="{ path: '/home/' + ite.path }"
            >
              <i class="el-icon-menu"></i>
              <span>{{ ite.authName }}</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>
        <div v-if="this.$route.path == '/home'">Welcome</div>
        <router-view></router-view>
      </el-main>
    </el-container>
  </el-container>
</template>

<script>
import http from "@/http";
export default {
  props: {},
  data() {
    return {
      menus: [],
      isopen: true,
      isrouter: true,
      dact: "",
      dopen: [],
    };
  },
  methods: {
    quit() {
      // 退出删除token值
      window.sessionStorage.removeItem("token");
      this.$router.push("/");
    },
  },
  mounted() {
    http({
      url: "menus",
    }).then((res) => {
      this.menus = res.data;
    });
  },
  components: {},
};
</script>

<style scoped lang="scss">
.el-container {
  height: 100%;
}
.el-header {
  background-color: #373d41;
  color: #fafbfc;
  line-height: 60px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  button {
    height: 40px;
  }
}

.el-aside {
  background-color: #333744;
  color: #fefefe;
  line-height: 200px;
  height: 100%;
}

.el-main {
  background-color: #eaedf1;
  color: #333;
}
</style>
