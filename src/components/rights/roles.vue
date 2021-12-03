<template>
  <div class="roles">
    <p class="path"><span>首页</span> &gt; 权限管理 &gt; 角色列表</p>
    <div class="wrap">
      <!-- <AddRoles></AddRoles> -->
      <el-button class="addRole" @click="addDialogShow" type="primary">
        添加角色
      </el-button>
      <el-table :data="rolesList" style="width: 100%" border stripe>
        <el-table-column type="expand">
          <template slot-scope="scope">
            <div class="scope">
              <div class="hide">
                <el-row
                  v-for="item1 in scope.row.children"
                  :key="item1.id"
                  class="centerRow"
                >
                  <!-- 这一列，专门渲染 一级权限 -->
                  <div class="stair">
                    <el-col :span="5">
                      <el-tag
                        closable
                        @close="removeRightById(scope.row, item1.id, item1)"
                        >{{ item1.authName }}</el-tag
                      >
                      <i class="el-icon-caret-right"></i>
                    </el-col>
                  </div>
                  <!-- 还剩余 19 列，分配给二三级权限 -->
                  <div class="second">
                    <el-col :span="19">
                      <!-- 这里显示二三级权限 -->
                      <el-row
                        v-for="item2 in item1.children"
                        :key="item2.id"
                        class="centerRow"
                      >
                        <!-- 放二级权限 -->
                        <el-col :span="6">
                          <el-tag
                            closable
                            type="success"
                            @close="removeRightById(scope.row, item2.id, item1)"
                            >{{ item2.authName }}</el-tag
                          >
                          <i class="el-icon-caret-right"></i>
                        </el-col>
                        <!-- 放三级权限 -->
                        <el-col :span="18">
                          <el-tag
                            closable
                            type="warning"
                            v-for="item3 in item2.children"
                            :key="item3.id"
                            @close="removeRightById(scope.row, item3.id, item1)"
                          >
                            {{ item3.authName }}</el-tag
                          >
                        </el-col>
                      </el-row>
                    </el-col>
                  </div>
                </el-row>
              </div>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="#" type="index" width="50"> </el-table-column>
        <el-table-column label="角色介绍" prop="roleName"> </el-table-column>
        <el-table-column label="角色描述" prop="roleDesc"> </el-table-column>
        <el-table-column label="操作" width="400">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              @click="showEditDialog(scope.row.id)"
              >编辑</el-button
            >
            <el-button
              type="danger"
              icon="el-icon-delete"
              @click="removeUser(scope.row.id)"
              >删除</el-button
            >
            <el-button
              type="warning"
              icon="el-icon-setting"
              @click="setRightShow(scope.row)"
              >分配权限</el-button
            >
          </template>
        </el-table-column>
      </el-table>
      <!-- 分配权限的对话框 -->
      <el-dialog title="分配权限" :visible.sync="setRight" width="50%">
        <!-- 权限菜单 -->
        <el-tree
          ref="tree"
          :data="rightTree"
          :props="treeConfig"
          show-checkbox
          node-key="id"
          default-expand-all
          :default-checked-keys="defKeys"
        ></el-tree>
        <span slot="footer" class="dialog-footer">
          <el-button @click="setRightHide">取 消</el-button>
          <el-button type="primary" @click="saveRight">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 编辑用户角色的对话框 -->
      <el-dialog
        title="修改角色信息"
        :visible.sync="editDialogVisible"
        width="50%"
        @close="editDialogClosed"
      >
        <el-form
          :model="editForm"
          :rules="addFormRules"
          ref="editFormRef"
          label-width="90px"
        >
          <el-form-item label="角色名称" prop="roleName">
            <el-input v-model="editForm.roleName"></el-input>
          </el-form-item>
          <el-form-item label="角色描述" prop="roleDesc">
            <el-input v-model="editForm.roleDesc"></el-input>
          </el-form-item>
        </el-form>
        <!--底部按钮区域-->
        <span slot="footer" class="dialog-footer">
          <el-button @click="editDialogVisible = false">取 消</el-button>
          <el-button type="primary" @click="editUserInfo">确 定</el-button>
        </span>
      </el-dialog>
      <!-- 添加用户的对话框 -->
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
  </div>
</template>

<script>
import http from "@/http";
export default {
  props: {},
  data() {
    return {
      userInfo: {},

      // 添加用户
      addDialog: false, // 添加对话框是否显示
      rolesList: [], // 角色列表数据
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

      // 修改用户
      setRight: false, // 添加弹出框
      editDialogVisible: false, // 修改弹出框
      resetSetRightDialog: false,
      editForm: {
        // roleId: 0,
        roleName: "",
        roleDesc: "",
      },

      // 分配权限 树
      rightTree: [],
      defaultCheckedKeys: [],
      treeConfig: {
        label: "authName",
        children: "children",
      },

      defKeys: [], // 默认选中的结点ID值数组
      roleId: "", //当前角色
    };
  },
  mounted() {
    http({
      url: "roles",
    }).then((res) => {
      if (res.meta.status !== 200) {
        return this.$message.error("获取角色列表失败！");
      } else {
        this.rolesList = res.data;
      }
    });
  },
  methods: {
    setRightHide() {
      this.setRight = false;
    },

    // 封装数据渲染数据的方法
    getRoleList() {
      http({
        url: "roles",
      }).then((res) => {
        if (res.meta.status !== 200) {
          this.$message.success("获取角色列表失败");
        }
        this.rolesList = res.data;
      });
    },

    // 添加用户的一些方法
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

    // 修改用户的一些方法
    async showSetRoleDialog(userInfo) {
      console.log(userInfo);
      this.userInfo = userInfo;
      http({
        url: "roles",
      }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取角色列表失败！");
        } else {
          this.rolesList = res.data;
          this.setRoleDialogVidible = true;
        }
      });
    },

    // 监听、修改角色状态  编辑按钮
    showEditDialog(id) {
      this.editDialogVisible = true;
      console.log(id);
      http({
        url: `roles/${id}`,
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("查询角色信息失败！");
        }
        this.editForm = res.data;
      });
    },

    // 根据ID删除用户的功能
    removeUser(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该角色，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `roles/${id}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            if (res.meta.status != 200) {
              return this.$message.success("删除角色失败！");
            } else {
              this.$message.error("删除角色成功！");
              this.getRoleList();
            }
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 点击按钮 修改角色信息   编辑之后确认按钮
    editUserInfo() {
      this.$refs.editFormRef.validate(async (valid) => {
        if (!valid) return;
        // 可以发起修改用户信息的网络请求
        console.log(this.editForm);
        http({
          url: `roles/${this.editForm.roleId}`,
          method: "put",
          data: {
            roleName: this.editForm.roleName,
            roleDesc: this.editForm.roleDesc,
          },
        }).then((res) => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("修改角色信息失败！");
          } else {
            this.$message.success("修改角色信息成功！");
            // 关闭对话框
            this.editDialogVisible = false;
            // 重新发起请求角色列表
            this.getRoleList();
          }
        });
      });
    },

    // 根据指定的节点和keys数组，递归获取所有三级节点的Id
    getLeafIds(node, keys) {
      if (!node.children) {
        return keys.push(node.id);
      } else {
        node.children.forEach((item) => {
          this.getLeafIds(item, keys);
        });
      }

      // this.getLeafIds(node, keys);
      // this.defaultCheckedKeys = keys;
    },

    // 修改用户权限   展示树状图  修改用户权限
    setRightShow(role) {
      // console.log(role);
      http({
        url: "rights/tree",
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("初始化权限失败");
        } else {
          this.rightTree = res.data;
          this.defKeys = [];
          this.getLeafIds(role, this.defKeys);
          // this.defaultCheckedKeys=this.defKeys
          this.setRight = true;
          this.roleId = role.id;
        }
      });
    },

    // 分配权限后  确认修改按钮
    saveRight() {
      const arr1 = this.$refs.tree.getCheckedKeys();
      const arr2 = this.$refs.tree.getHalfCheckedKeys();
      console.log(arr1);
      console.log(arr2);

      const idStr = [...arr1, ...arr2].join(",");
      console.log(idStr, typeof idStr);
      http({
        url: `roles/${this.roleId}/rights`,
        method: "post",
        data: {
          rids: idStr,
        },
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("分配权限失败！");
        } else {
          this.$message.success("分配权限成功！");
          this.setRight = false;
          this.getRoleList();
        }
      });
    },

    editDialogClosed() {
      // 重置表单
      this.$refs.editFormRef.resetFields();
    },

    // 根据ID删除权限
    removeRightById(role, rightId) {
      console.log(role);
      this.$confirm("此操作将永久删除该角色，是否继续？", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `roles/${role.id}/rights/${rightId}`,
            method: "delete",
          }).then((res) => {
            if (res.meta.status !== 200) {
              return this.$message.error("删除权限失败！");
            }
            this.$message.success("删除权限成功！");
            role.children = res.data;
          });
        })
        .catch(() => {
          return this.$message.info("已取消删除");
        });
    },
  },
  components: {},
};
</script>

<style scoped lang="scss">
.roles {
  box-sizing: border-box;
  position: relative;
  .path {
    font-size: 14px;
    span {
      font-weight: bold;
    }
  }

  .wrap {
    position: absolute;
    width: 100%;
    margin-top: 15px;
    background-color: #fff;
    padding: 0 20px 35px;
    box-sizing: border-box;
    .addRole {
      margin: 20px 0 15px;
    }

    // 隐藏的权限管理
    .scope {
      padding: 0 50px;
      .hide {
        border-top: 1px solid #eee;
        border-bottom: 1px solid #eee;
        .el-col-19 {
          width: 100%;
        }
        .el-col-19 > div:not(.el-col-19 > div:last-child) {
          border-bottom: 1px solid #eee;
        }
        .el-col-19 > div {
          flex: 1;
          padding-bottom: 7px;
          display: flex;
          align-items: center;
        }

        .el-col-6 {
          position: relative;
          top: 3px;
        }

        .el-col-18 {
          flex: 1;
          span {
            margin-right: 10px;
            margin-top: 7px;
          }
        }
        .stair {
          overflow: hidden;
          float: left;
          width: 200px;
          .el-col-5 {
            display: flex;
            align-items: center;
          }
        }
        .second {
          flex: 1;
          overflow: hidden;
        }
      }
      .hide > div:not(.hide > div:last-child) {
        border-bottom: 1px solid #eee;
      }
      .hide > div {
        display: flex;
        align-items: center;
      }
    }
  }
}
</style>
