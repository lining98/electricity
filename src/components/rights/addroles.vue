<template>
  <div>
    <el-button class="addRole" @click="addDialogShow" type="primary"
      >添加角色</el-button
    >
    <el-dialog
      title="提示"
      :visible.sync="addDialog"
      width="30%"
      @close="addDialogClosed"
    >
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="90px"
      >
        <el-form-item label="角色名称" prop="roleName">
          <el-input v-model="addForm.roleName"></el-input>
        </el-form-item>
        <el-form-item label="角色描述" prop="roleDesc">
          <el-input v-model="addForm.roleDesc"></el-input>
        </el-form-item>
      </el-form>
      <!-- 底部按钮区域 -->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogHide">取 消</el-button>
        <el-button type="primary" @click="addRole">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/http";
export default {
  props: {},
  data() {
    return {
      addDialog: false, // 添加对话框是否显示
      roleList: [], // 角色列表数据
      // 添加角色的表单数据
      addForm: {
        roleName: "",
        roleDesc: "",
      },
      ifadd: false,
      // 添加用户表单的验证规则对象
      addFormRules: {
        roleName: [
          { required: true, message: "请输入角色名称", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "blur" },
        ],
        roleDesc: [
          { required: true, message: "请输入角色描述", trigger: "blur" },
          { min: 2, max: 10, message: "长度在2到10个字符", trigger: "blur" },
        ],
      },
    };
  },
  updated() {
    // this.getRoleList();
  },
  methods: {
    async getRoleList() {
      http({
        url: "roles",
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          this.$message.success("获取角色列表失败");
        }
        this.roleList = res.data;
      });
    },
    addDialogShow() {
      this.addDialog = true;
    },
    addDialogHide() {
      this.addDialog = false;
    },
    addDialogClosed() {
      this.$refs.addFormRef.resetFields();
    },
    addRole() {
      this.$refs.addFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起添加角色的网络请求
        http({
          url: "roles",
          method: "post",
          data: {
            roleName: this.addForm.roleName,
            roleDesc: this.addForm.roleDesc,
          },
        }).then((res) => {
          if (res.meta.status !== 201) {
            return this.$message.error("添加角色失败");
          } else {
            this.$message.success("添加角色成功");
            this.addDialog = false;
            this.getRoleList();
          }
        });
      });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.addRole {
  margin: 20px 0 15px;
}
</style>
