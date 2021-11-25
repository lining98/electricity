<template>
  <el-container>
    <el-header
      ><span>电商后台管理系统</span>
      <el-button @click="quit" type="info">退出</el-button></el-header
    >
    <el-container>
      <el-aside width="200px">
        <el-menu
          class="el-menu-vertical-demo"
          background-color="#545c64"
          text-color="#fff"
          active-text-color="#ffd04b"
        >
          <!-- 一级菜单 -->
          <el-submenu index="1">
            <template slot="title">
              <i class="el-icon-menu"></i>
              <span>用户管理</span>
            </template>
            <!-- 二级菜单 -->
            <el-menu-item>
              <i class="el-icon-menu"></i>
              <span>二级菜单1</span>
            </el-menu-item>
            <el-menu-item>
              <i class="el-icon-menu"></i>
              <span>二级菜单2</span>
            </el-menu-item>
          </el-submenu>
        </el-menu>
      </el-aside>
      <el-main>Welcome</el-main>
    </el-container>
  </el-container>
</template>

<script>
// import http from "@/http";
export default {
  props: {},
  data() {
    return {};
  },
  methods: {
    quit() {
      this.$router.push("/");
    },
  },
  mounted() {
    // http({
    //   url:''
    // })
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
  text-align: center;
  line-height: 160px;
}
</style>
