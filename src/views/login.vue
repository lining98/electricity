<template>
  <div class="login">
    <el-form
      :model="ruleForm"
      :rules="rules"
      ref="ruleForm"
      label-width="70px"
      class="login_form"
    >
      <el-form-item class="item" label="用户名" prop="username">
        <i class="el-icon-s-custom"></i>
        <el-input
          v-model="ruleForm.username"
          placeholder="请输入用户名"
          clearable
        ></el-input>
      </el-form-item>
      <el-form-item class="item" label="密码" prop="pwd">
        <i class="el-icon-lock"></i>
        <el-input
          placeholder="请输入密码"
          v-model="ruleForm.pwd"
          clearable
          show-password
        ></el-input>
      </el-form-item>
      <div class="btn">
        <el-button @click="login_" type="primary">登录</el-button>
        <el-button @click="reset" type="info">重置</el-button>
      </div>
    </el-form>
  </div>
</template>

<script>
import http from "@/http";
export default {
  props: {},
  data() {
    return {
      ruleForm: {
        username: "admin",
        pwd: "123456",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户名", trigger: "blur" },
        ],
        pwd: [{ required: true, message: "请输入密码", trigger: "blur" }],
      },
    };
  },
  methods: {
    login_() {
      http({
        url: "login",
        method: "post",
        data: {
          username: this.ruleForm.username,
          password: this.ruleForm.pwd,
        },
      }).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) {
          this.$message.error(res.meta.msg);
        } else {
          this.$message.success("登录成功！");
          // 把登录成功的token保存到sessionStorage
          window.sessionStorage.setItem("token", res.data.token);
          // 使用编程式导航，跳转到后台主页
          this.$router.push("/home");
        }
      });
    },
    reset() {
      this.ruleForm.username = "";
      this.ruleForm.pwd = "";
    },
  },
  mounted() {},
  components: {},
};
</script>

<style scoped lang="scss">
.login {
  height: 100%;
  background-color: #2b4b6b;
  display: flex;
  justify-content: center;
  align-items: center;
  .login_form {
    width: 450px;
    height: 300px;
    background-color: #fff;
    padding: 114px 21px 22px 20px;
    box-sizing: border-box;
    border-radius: 3px;
  }
  .item {
    position: relative;
    i {
      position: absolute;
      z-index: 1;
      color: #ccc;
      left: 2px;
      top: 50%;
      transform: translateY(-50%);
    }
  }
  .btn {
    display: flex;
    justify-content: end;
  }
}
</style>
