<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>用户管理</el-breadcrumb-item>
      <el-breadcrumb-item>用户列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 用户信息列表 -->
    <div class="message_list">
      <div class="message_input">
        <!-- 搜索框 -->
        <el-input
          placeholder="请输入搜索的内容"
          v-model="query"
          clearable
          @clear="getUserList"
          class="el_input"
        >
          <el-button
            slot="append"
            icon="el-icon-search"
            @click="getUserList"
          ></el-button>
        </el-input>
        <!-- 添加用户 -->
        <el-button type="primary" @click="dialogVisible = true"
          >添加用户</el-button
        >
        <el-dialog
          title="添加用户"
          :visible.sync="dialogVisible"
          width="30%"
          :before-close="handleClose"
        >
          <div class="user_">
            <el-form
              :model="ruleForm"
              :rules="rules"
              ref="ruleForm"
              label-width="100px"
              class="demo-ruleForm"
              :hide-required-asterisk="true"
            >
              <el-form-item label="姓名" prop="username">
                <el-input v-model="ruleForm.username"></el-input>
              </el-form-item>
              <el-form-item label="密码" prop="password">
                <el-input v-model="ruleForm.password"></el-input>
              </el-form-item>
              <el-form-item label="邮箱" prop="email">
                <el-input v-model="ruleForm.email"></el-input>
              </el-form-item>
              <el-form-item label="电话" prop="mobile">
                <el-input v-model="ruleForm.mobile"></el-input>
              </el-form-item>
            </el-form>
          </div>
          <span slot="footer" class="dialog-footer">
            <el-button type="primary" @click="submitForm('ruleForm')"
              >确 定</el-button
            >
            <el-button @click="resetForm('ruleForm')">取 消</el-button>
          </span>
        </el-dialog>
      </div>
      <!-- 渲染的用户列表 -->
      <el-table :data="tableData" border style="width: 100%">
        <el-table-column prop="id" label="#" width="100"></el-table-column>
        <el-table-column
          prop="username"
          label="姓名"
          width="200"
        ></el-table-column>
        <el-table-column
          prop="email"
          label="邮箱"
          width="300"
        ></el-table-column>
        <el-table-column
          prop="mobile"
          label="电话"
          width="259"
        ></el-table-column>
        <el-table-column
          prop="role_name"
          label="角色"
          width="260"
        ></el-table-column>
        <!-- 用户的状态修改 -->
        <el-table-column prop="mg_state" width="200" label="状态">
          <template slot-scope="scope">
            <!-- 开 关 -->
            <el-switch
              v-model="scope.row.mg_state"
              @change="stateChanged(scope.row.id, scope.row.mg_state)"
            >
            </el-switch>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <!-- 修改用户 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-dialog
              title="修改用户"
              width="30%"
              :visible.sync="dialogTableVisible"
            >
              <div class="user_">
                <el-form
                  label-width="100px"
                  class="demo-ruleForm"
                  :hide-required-asterisk="true"
                >
                  <el-form-item label="姓名" prop="username">
                    <el-input
                      :disabled="true"
                      v-model="change_.username"
                    ></el-input>
                  </el-form-item>
                  <el-form-item label="邮箱" prop="email">
                    <el-input v-model="change_.email"></el-input>
                  </el-form-item>
                  <el-form-item label="电话" prop="mobile">
                    <el-input v-model="change_.mobile"></el-input>
                  </el-form-item>
                </el-form>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button type="primary" @click="chan_ye()">确 定</el-button>
                <el-button @click="remo_no()">取 消</el-button>
              </span>
            </el-dialog>
            <!-- 删除用户 -->
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-delete"
              @click="removeUserById(scope.row.id)"
              class="remove_"
            ></el-button>
            <!-- 分配角色 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-s-tools"
              @click="handleTools(scope.$index, scope.row)"
            ></el-button>
            <!-- 更改角色权限的弹出框 -->
            <el-dialog
              title="分配角色"
              :visible.sync="dialogVisibles"
              width="30%"
            >
              <div>
                <p>
                  当前的用户：<span>{{ gives.username }}</span>
                </p>
                <p>
                  当前的角色：<span>{{ gives.role_name }}</span>
                </p>
                <p>
                  分配新角色:
                  <el-select v-model.number="gives.value" placeholder="请选择">
                    <el-option
                      v-for="item in give_list"
                      :key="item.id"
                      :label="item.roleName"
                      :value="item.id"
                    >
                    </el-option>
                  </el-select>
                </p>
              </div>
              <span slot="footer" class="dialog-footer">
                <el-button @click="give_no()">取 消</el-button>
                <el-button @click="give_yes()" type="primary">确 定</el-button>
              </span>
            </el-dialog>
          </template>
        </el-table-column>
      </el-table>
    </div>

    <!-- 显示页数 -->
    <div class="message_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 3, 5, 10]"
        :page-size="pagesize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
      >
      </el-pagination>
    </div>
  </div>
</template>

<script>
import http from "@/http";
export default {
  props: {},
  data() {
    return {
      tableData: [], //数据列表
      pagenum: 1, //当前页数
      pagesize: 3, //当前页数显示的内容
      input: "", //输入框的value值
      total: 0, //用户的总数量
      query: null, //搜索的输入值
      id: null, //用户的id
      mg_state: false, //用户状态的布尔值
      dialogVisible: false, //删除用户的布尔值
      dialogTableVisible: false, //修改用户的布尔值
      dialogVisibles: false, //分配角色的布尔值
      give_list: [],
      gives: {
        username: "",
        role_name: "",
        value: "",
        id: "",
        rid: "",
      },
      change_: {
        username: "",
        email: "",
        mobile: "",
        id: null,
      },
      ruleForm: {
        username: "",
        password: "",
        mobile: "",
        email: "",
      },
      rules: {
        username: [
          { required: true, message: "请输入用户姓名", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        mobile: [
          { required: true, message: "请输入手机号", trigger: "blur" },
          {
            min: 11,
            max: 11,
            message: "请按照正确的格式输入",
            trigger: "blur",
          },
        ],
        password: [
          { required: true, message: "请输入密码", trigger: "blur" },
          { min: 3, max: 5, message: "长度在 3 到 5 个字符", trigger: "blur" },
        ],
        email: [
          { required: true, message: "请输入邮箱地址", trigger: "blur" },
          // {
          //   type: "email",
          //   message: "请输入正确的邮箱地址",
          //   trigger: ["blur", "change"],
          // },
        ],
      },
    };
  },
  methods: {
    // 封装方法，调用重新渲染数据
    axiso_s() {
      http({
        url: `/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户列表失败！");
        }
        this.tableData = res.data.users;
        this.total = res.data.total;
      });
    },
    // 添加用户
    handleClose(done) {
      this.$confirm("确认关闭？")
        .then(() => {
          done();
        })
        .catch(() => {});
    },
    // 添加用户取消和确定按钮
    submitForm(formName) {
      this.$refs[formName].validate((valid) => {
        console.log(valid);
        http({
          url: "/users",
          method: "post",
          data: {
            username: this.ruleForm.username,
            password: this.ruleForm.password,
            email: this.ruleForm.email,
            mobile: this.ruleForm.mobile,
          },
        }).then((res) => {
          if (
            this.username == "" ||
            this.password == "" ||
            res.meta.status == 400
          ) {
            this.$message({
              message: res.meta.msg,
              type: "error",
            });
          } else {
            console.log(res);
            this.$message({
              message: res.meta.msg,
              type: "success",
            });
            this.dialogVisible = false;
            this.axiso_s();
            this.$refs[formName].resetFields();
          }
        });
      });
    },
    resetForm(formName) {
      this.dialogVisible = false;
      this.$refs[formName].resetFields();
    },
    //修改用户状态
    stateChanged(id, mg_state) {
      // console.log(id,mg_state)
      this.id = id;
      this.mg_state = mg_state;
      // console.log( this.id,this.mg_state);
      http({
        url: `users/${this.id}/state/${this.mg_state}`,
        method: "put",
      }).then((res) => {
        // console.log(res);
        this.$message({
          message: res.meta.msg,
          type: "success",
        });
      });
    },
    // 修改编辑当前内容
    handleEdit(index, row) {
      // console.log(index, row);
      this.change_.username = row.username;
      this.change_.email = row.email;
      this.change_.mobile = row.mobile;
      this.change_.id = row.id;
      // console.log(this.change_);
      this.dialogTableVisible = true;
    },
    chan_ye() {
      http({
        url: `/users/${this.change_.id}`,
        method: "put",
        data: {
          email: this.change_.email,
          mobile: this.change_.mobile,
        },
      })
        .then((res) => {
          console.log(res);
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.dialogTableVisible = false;
          this.axiso_s();
        })
        .catch((res) => {
          this.$message({
            message: res.meta.msg,
            type: "error",
          });
        });
    },
    remo_no() {
      this.dialogTableVisible = false;
    },
    // 根据ID删除对应的用户信息
    async removeUserById(id) {
      console.log(id);
      // 弹框 询问用户是否删除
      const confirmResult = await this.$confirm(
        "此操作将永久删除该角色, 是否继续?",
        "提示",
        {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        }
      )
        .then(() => {
          http({
            url: `/users/${id}`,
            method: "delete",
          }).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error("删除角色失败");
            }
            this.$message.success("删除角色成功");
            this.axiso_s();
          });
        })
        .catch(() => {
          if (confirmResult !== "confirm") {
            return this.$message.info("已取消删除");
          }
        });
    },
    //更改权限
    handleTools(index, row) {
      // console.log(index, row);
      // console.log(this.gives);
      this.gives.username = row.username;
      this.gives.role_name = row.role_name;
      this.gives.id = row.id;
      this.dialogVisibles = true;
    },
    give_no() {
      this.dialogVisibles = false;
    },
    give_yes() {
      http({
        url: `/users/${this.gives.id}/role`,
        method: "put",
        data: {
          id: this.gives.id,
          rid: this.gives.value,
        },
      })
        .then((res) => {
          // console.log(this.gives);
          // console.log(res);
          if (res.meta.status !== 200) {
            return this.$message({
              message: res.meta.msg,
              type: "error",
            });
          }
          this.$message({
            message: res.meta.msg,
            type: "success",
          });
          this.axiso_s();
          this.dialogVisibles = false;
        })
        .catch((res) => {
          this.$message({
            message: res.meta.msg,
            type: "error",
          });
        });
    },
    // 页数变化点击函数
    handleSizeChange(val) {
      // console.log(`每页 ${val} 条`);
      this.pagesize = parseInt(`${val}`);
      http({
        url: `/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        this.tableData = res.data.users;
        this.total = res.data.total;
        // this.pagenum = parseInt(res.data.pagenum)
      });
    },
    handleCurrentChange(val) {
      // console.log(`当前页: ${val}`);
      this.pagenum = parseInt(`${val}`);
      http({
        url: `/users?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        this.tableData = res.data.users;
        this.total = res.data.total;
      });
    },
    // 搜索用户的功能,根据id查询
    getUserList() {
      http({
        url: `/users/${this.query}`,
      }).then((res) => {
        // console.log(res);
        this.tableData = this.tableData.filter((item) => {
          if (item.id === res.data.id) {
            return item;
          }
        });
      });
    },
  },

  components: {},

  mounted() {
    this.axiso_s();
    http({
      url: "/roles",
    }).then((res) => {
      // console.log(res);
      this.give_list = res.data;
    });
  },
};
</script>

<style scoped lang="scss">
.message_list {
  margin-top: 17px;
  padding: 30px;
  background-color: white;
  .message_input {
    display: flex;
    width: 500px;
    margin-bottom: 15px;
    .el_input {
      margin-right: 50px;
    }
  }
}
.message_page {
  background-color: white;
  padding: 0 30px 30px 30px;
}
.remove_ {
  margin: 0 30px;
}
</style>
