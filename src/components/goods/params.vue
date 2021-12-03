<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>参数列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mainwrapper">
      <!-- 参数设置表格 -->
      <el-form :model="add" ref="add" label-width="100px" class="demo-dynamic">
        <!-- 提示 -->
        <el-alert
          title="注意: 只允许为第三级分类设置相关参数"
          type="warning"
          show-icon
        >
        </el-alert>
        <!-- 选择级联 -->
        <el-form-item label="选择商品分类: " label-width="100px">
          <div class="block">
            <el-cascader
              placeholder="请选择"
              v-model="selectedCate"
              :options="cateList"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                children: 'children',
              }"
              clearable
              @change="handleChange()"
              getCheckedNodes
            >
            </el-cascader>
          </div>
        </el-form-item>
        <!--Tabs标签区域-->
        <el-tabs v-model="activeName" @tab-click="handleTabClick">
          <!-- 添加动态参数的面板 -->
          <el-tab-pane label="动态参数" name="many">
            <!-- 添加参数的按钮 -->
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisabled"
              @click="showAddDialog"
              >添加参数</el-button
            >
            <!-- 动态参数表格 -->
            <el-table :data="manytableData" border stripe>
              <!-- 展开列 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="handleClosed(scope.row, i)"
                    >{{ item }}</el-tag
                  >
                  <!--输入文本框-->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <!--添加的按钮-->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"> </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-edit"
                    @click="delParamsDialog(scope.row.attr_id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
          <!-- 添加静态属性的面板 -->
          <el-tab-pane label="静态属性" name="only">
            <!-- 添加属性的按钮 -->
            <el-button
              type="primary"
              size="mini"
              :disabled="isBtnDisabled"
              @click="showAddDialog"
              >添加属性</el-button
            >
            <!-- 添加参数表格 -->
            <el-table :data="onlytableData" border stripe>
              <!-- 展开列 -->
              <el-table-column type="expand">
                <template slot-scope="scope">
                  <!-- 循环渲染tag标签 -->
                  <el-tag
                    v-for="(item, i) in scope.row.attr_vals"
                    :key="i"
                    closable
                    @close="handleClosed(scope.row, i)"
                    >{{ item }}</el-tag
                  >
                  <!--输入文本框-->
                  <el-input
                    class="input-new-tag"
                    v-if="scope.row.inputVisible"
                    v-model="scope.row.inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm(scope.row)"
                    @blur="handleInputConfirm(scope.row)"
                  ></el-input>
                  <!--添加的按钮-->
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput(scope.row)"
                    >+ New Tag</el-button
                  >
                </template>
              </el-table-column>
              <el-table-column type="index" label="#"> </el-table-column>
              <el-table-column label="参数名称" prop="attr_name">
              </el-table-column>
              <el-table-column label="操作">
                <!-- 作用域插槽 -->
                <template slot-scope="scope">
                  <el-button
                    size="mini"
                    type="primary"
                    icon="el-icon-edit"
                    @click="showEditDialog(scope.row.attr_id)"
                    >编辑</el-button
                  >
                  <el-button
                    size="mini"
                    type="danger"
                    icon="el-icon-edit"
                    @click="delParamsDialog(scope.row.attr_id)"
                    >删除</el-button
                  >
                </template>
              </el-table-column>
            </el-table>
          </el-tab-pane>
        </el-tabs>
        <div></div>
      </el-form>
    </div>
    <!-- 添加参数的对话框 -->
    <el-dialog
      :title="'添加' + titleText"
      :visible.sync="addDialogVisible"
      width="50%"
      @close="addDialogClosed"
    >
      <!-- 内容主题区域 -->
      <el-form
        :model="addForm"
        :rules="addFormRules"
        ref="addFormRef"
        label-width="90px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="addForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="addDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="addParams">确 定</el-button>
      </span>
    </el-dialog>
    <!-- 编辑 修改参数的对话框 -->
    <el-dialog
      :title="'修改' + titleText"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editDialogClosed"
    >
      <!--内容主体区域-->
      <el-form
        :model="editForm"
        :rules="addFormRules"
        ref="editFormRef"
        label-width="90px"
      >
        <el-form-item :label="titleText" prop="attr_name">
          <el-input v-model="editForm.attr_name"></el-input>
        </el-form-item>
      </el-form>
      <!--底部按钮区域-->
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editParams">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
import http from "@/http";
export default {
  data() {
    return {
      activeName: "many", //导航下标
      cateList: [], //级联选择器的可选数据  商品分类列表数据
      manytableData: [], // 动态参数的数据列表
      onlytableData: [], // 静态属性的数据列表
      selectedCate: [], // 级联选择框双向绑定，选中的商品分类的ID数组
      add: null,
      inputVisible: false,
      inputValue: "",

      cateId: 0, // 第三级的id

      addDialogVisible: false, // 控制添加参数对话框是否显示
      editDialogVisible: false, // 控制修改参数对话框是否显示
      // 添加 修改 参数的表单数据对象
      addForm: {
        attr_name: "",
      },
      editForm: {
        attr_name: "",
      },
      // 添加表单的验证规则对象
      addFormRules: {
        attr_name: [
          { required: true, message: "请输入参数名称", trigger: "blur" },
        ],
      },
    };
  },
  computed: {
    // 如果按钮需要被禁用 则返回true，否则返回false
    isBtnDisabled() {
      if (this.selectedCate.length !== 3) {
        return true;
      }
      return false;
    },
    titleText() {
      if (this.activeName === "many") {
        return "动态参数";
      } else {
        return "静态属性";
      }
    },
  },
  created() {
    this.getAllCateList();
  },
  methods: {
    // 获取所有商品的分类列表
    getAllCateList() {
      http({
        url: "categories",
      })
        .then((res) => {
          if (res.meta.status !== 200) {
            return this.$message.error("获取商品分类列表失败！");
          } else {
            this.cateList = res.data;
          }
        })
        .catch((err) => console.log(err));
    },

    /* 获取静态属性或动态参数 */
    handleChange() {
      console.log(this.selectedCate);
      if (this.selectedCate.length !== 3) {
        // 没有选中三级分类，把分类重置为空
        this.selectedCate = [];
        this.manytableData = [];
        this.onlytableData = [];
        return;
      }
      this.getParamList();
    },
    // 获取参数的列表数据
    getParamList() {
      const id = this.selectedCate[2];
      this.cateId = id;
      // console.log(id);
      http({
        url: `/categories/${id}/attributes`,
        params: { sel: this.activeName },
      }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("获取参数列表失败");
        }
        console.log(res.data);
        // 循环所选的id和当前所处的面板，获取对应的参数数据列表
        res.data.forEach((item) => {
          item.attr_vals = item.attr_vals ? item.attr_vals.split(" ") : [];

          // 控制文本框的显示与隐藏
          item.inputVisible = false;
          // 文本框中输入的值
          item.inputValue = "";
        });

        if (this.activeName === "many") {
          this.manytableData = res.data;
        } else {
          this.onlytableData = res.data;
        }
      });
    },

    // 监听 添加参数对话框的关闭事件
    addDialogClosed() {
      // 表单内容重置为空
      this.$refs.addFormRef.resetFields();
    },
    //显示添加参数的对话框
    showAddDialog() {
      this.addDialogVisible = true;
    },
    // 点击确认 添加新的参数
    addParams() {
      this.$refs.addFormRef.validate((valid) => {
        if (!valid) return;
        // console.log(this.cateId);
        http({
          url: `categories/${this.cateId}/attributes`,
          method: "post",
          data: {
            attr_name: this.addForm.attr_name,
            attr_sel: this.activeName,
          },
        }).then((res) => {
          console.log(res);
          if (res.meta.status !== 201) {
            return this.$message.error("添加参数失败！");
          }
          this.$message.success("添加参数成功！");
          this.getParamList();
          this.addDialogVisible = false;
        });
      });
    },

    // 监听 展示编辑参数的对话框
    showEditDialog(attrid) {
      this.editDialogVisible = true;
      console.log(attrid);
      http({
        url: `categories/${this.cateId}/attributes/${attrid}`,
        params: {
          attr_name: this.attr_name,
          attr_sel: this.activeName,
        },
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("查询参数信息失败");
        }
        this.editForm = res.data;
      });
    },
    // 监听 编辑参数对话框的关闭事件
    editDialogClosed() {
      // 表单内容重置为空
      this.$refs.editFormRef.resetFields();
    },
    // 点击确认 编辑修改参数
    editParams() {
      // console.log(this.editForm.attr_name);
      this.$refs.editFormRef.validate((valid) => {
        if (!valid) return;
        http({
          url: `categories/${this.cateId}/attributes/${this.editForm.attr_id}`,
          method: "put",
          data: {
            attr_name: this.editForm.attr_name,
            attr_sel: this.activeName,
          },
        }).then((res) => {
          console.log(res);
          if (res.meta.status !== 200) {
            return this.$message.error("修改参数信息失败！");
          }
          this.$message.success("修改参数信息成功！");
          this.getParamList();
          this.editDialogVisible = false;
        });
      });
    },
    // 删除参数
    delParamsDialog(id) {
      console.log(id);
      this.$confirm("此操作将永久删除该参数，是否继续？", "提示", {
        // confirmButtonText: "确定",
        // cancleButtonText: "取消",
        type: "warning",
      })
        .then(() => {
          http({
            url: `categories/${this.cateId}/attributes/${id}`,
            method: "delete",
          }).then((res) => {
            console.log(res);
            if (res.meta.status !== 200) {
              return this.$message.error("删除参数信息失败！");
            }
            this.$message.success("删除参数信息成功！");
            this.getParamList();
          });
        })
        .catch(() => {
          this.$message.info("已取消删除");
        });
    },

    // 文本框失去焦点或按下回车键时都会触发
    handleInputConfirm(row) {
      if (row.inputValue.trim().length === 0) {
        row.inputValue = "";
        row.inputVisible = false;
        return;
      }
      // 如果没有return，则证明输入的内容，需要做后续处理
      // console.log('ok')
      row.attr_vals.push(row.inputValue.trim());
      row.inputValue = "";
      row.inputVisible = false;
      this.saveAttrVals(row);
    },
    saveAttrVals(row) {
      http({
        url: `categories/${this.cateId}/attributes/${row.attr_id}`,
        method: "put",
        data: {
          attr_name: row.attr_name,
          attr_sel: row.attr_sel,
          attr_vals: row.attr_vals.join(" "),
        },
      }).then((res) => {
        if (res.meta.status !== 200) {
          return this.$message.error("添加修改参数项失败！");
        }
        this.$message.success("添加修改参数项成功！");
      });
    },
    // 点击按钮展示文本输入框
    showInput(row) {
      // console.log(row);
      row.inputVisible = true;
    },
    // 根据索引值删除对应参数的可选项
    handleClosed(row, i) {
      // console.log(row);
      // console.log(i);
      row.attr_vals.splice(i, 1);
      // 发起请求保存操作
      this.saveAttrVals(row);
    },

    handleTabClick() {
      // console.log(this.activeName);
      this.getParamList();
    },
  },
  mounted() {
    // this.getAllCateList();
  },
};
</script>

<style scoped lang="scss">
.warning-wrapper {
  color: #e6a23c;
  background-color: #faecd8;
}
.mainwrapper ::v-deep {
  background-color: #fff;
  padding: 20px;
  .el-alert {
    margin-bottom: 15px;
    .warning-wrapper {
      padding: 10px;
      .el-icon-warning {
        font-size: 20px;
        margin-right: 8px;
      }
    }
  }
  /* 表 */
  // 切换栏
  .el-menu-item {
    font-size: 16px;
  }
  .add-param-btn {
    margin: 15px 0;
    &.unaddable {
      background-color: #fff;
    }
  }
  .el-table__expanded-cell {
    padding: 10px 50px;
    .el-tag {
      margin: 5px 10px;
      & + * {
        margin: 5px 10px;
      }
    }
  }
}
.input-new-tag {
  width: 120px;
}
</style>
