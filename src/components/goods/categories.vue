<template>
  <div class="shop_set">
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品分类</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 弹窗添加 -->
    <!-- 弹窗提示 -->
    <el-dialog
      title="添加分类"
      :visible.sync="dialogVisible"
      width="30%"
      :before-close="handleClose"
    >
      <el-form :model="add" ref="add" label-width="100px" class="demo-dynamic">
        <el-form-item
          label="分类名称"
          label-width="100px"
          prop="cat_name"
          :rules="[
            { required: true, message: '请输入活动名称', trigger: 'blur' },
            {
              min: 1,
              max: 9,
              message: '长度在 1 到 9 个字符',
              trigger: 'blur',
            },
          ]"
        >
          <el-input v-model="add.cat_name" autocomplete="off"></el-input>
        </el-form-item>
        <!-- 选择级联 -->
        <el-form-item label="父级分类" label-width="100px">
          <div class="block">
            <el-cascader
              v-model="parent.cat_id"
              :options="cateData"
              :props="{
                expandTrigger: 'hover',
                value: 'cat_id',
                label: 'cat_name',
                checkStrictly: true,
                children: 'children',
              }"
              @change="handleChange"
              clearable
            >
            </el-cascader>
          </div>
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="hideDialog">取 消</el-button>
        <el-button type="primary" @click="submitAdd"> 确 定 </el-button>
      </div>
    </el-dialog>
    <div class="mainwrapper">
      <!-- 添加分类按钮 -->
      <el-button type="primary" @click="addCategory">添加分类</el-button>
      <!-- 表格 -->
      <el-table
        :data="tableData"
        style="width: 100%"
        row-key="cat_id"
        border
        max-height="600"
        :tree-props="{ children: 'children', hasChildren: 'true' }"
      >
        <el-table-column label="#" type="index">
          <!-- 序号 -->
          <template slot-scope="scope" class="level-wrapper">
            {{ scope.row.sequence }}
          </template>
        </el-table-column>
        <el-table-column
          prop="cat_name"
          label="分类名称"
          :rules="[
            { required: true, message: '请输入分类名称', trigger: 'blur' },
          ]"
        >
          <template slot-scope="scope" v-if="tableDataRefresh">
            <div class="namecell">
              <el-input
                v-if="scope.row.edit"
                v-model="input_cat_name"
                placeholder="请输入分类名"
                maxlength="9"
                show-word-limit
                ref="input"
                @keyup.enter="blur()"
                @blur="blursubmit(scope.row)"
              ></el-input>
              <span
                v-else
                v-text="scope.row.cat_name"
                :ref="`span${scope.row.cat_id}`"
              ></span>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="是否有效">
          <template slot-scope="scope">
            <div slot="reference" class="level-wrapper">
              <el-icon
                :class="'el-icon-' + (scope.cat_deleted ? 'error' : 'success')"
              ></el-icon>
              {{ scope.cat_deleted }}
            </div>
          </template>
        </el-table-column>
        <el-table-column label="排序">
          <template slot-scope="scope">
            <div slot="reference" class="level-wrapper">
              <el-tag
                :type="
                  scope.row.cat_level
                    ? scope.row.cat_level == 1
                      ? 'success'
                      : 'warning'
                    : null
                "
              >
                {{
                  (scope.row.cat_level + 1).toLocaleString('zh-u-nu-hanidec')
                }}级
              </el-tag>
            </div>
          </template>
        </el-table-column>
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            >
              编辑
            </el-button>

            <el-popconfirm
              title="确定删除此分类吗？"
              @confirm="handleDelete(scope.row)"
            >
              <el-button
                slot="reference"
                type="danger"
                icon="el-icon-delete"
                size="mini"
              >
                删除
              </el-button>
            </el-popconfirm>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          :current-page="req.pagenum"
          :page-sizes="[5, 10, 20]"
          :page-size="req.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total"
        >
        </el-pagination>
      </div>
    </div>
  </div>
</template>
<script>
import http from '../../http'
export default {
  data() {
    return {
      input_cat_name: '',
      value: null,
      total: 0, //总数据
      tableData: [], //页面呈现
      tableDataRefresh: true,
      cateData: [],
      parent: {
        cat_name: [],
        cat_pid: [],
      }, //保存父节点信息
      loading: true,
      req: { type: 3, pagenum: 1, pagesize: 10 },
      columns: [],
      dialogVisible: false, //弹窗添加
      add: {
        cat_name: '',
        cat_pid: '',
        cat_level: '',
      }, //添加的提交参数
    }
  },
  methods: {
    // /* 表格相关 */
    /* 页面加载表格渲染参数 请求*/
    loaddata() {
      http({
        url: '/categories',
        params: this.req,
      })
        .then((result) => {
          console.log(result)

          if (result.meta.status !== 200) {
            return this.$message.error('获取商品分类失败')
          }
          this.total = result.data.total
          let res = result.data.result
          /* 给第一级添序号 */
          let num = 0
          res.forEach((item) => {
            item.sequence = ++num + (this.req.pagenum - 1) * this.req.pagesize
          })
          /* 表格显示数据 */
          this.tableData = res
        })
        .catch((err) => {
          console.warn(err)
        })
    },
    /* 页面切换事件 */
    handleCurrentChange(val) {
      if (this.req.pagenum === val) return
      this.req.pagenum = val
      this.loaddata()
    },
    /* 页面数据数量改变事件 */
    handleSizeChange(val) {
      if (this.req.pagesize === val) return
      this.req.pagesize = val
      this.loaddata()
    },
    // /* 添加分类相关 */
    /* 添加分类按钮事件 */
    addCategory() {
      this.add = {
        cat_name: '',
        cat_pid: '',
        cat_level: '',
      }
      this.parent = {
        cat_name: '',
        cat_pid: '',
      } //保存父节点信息
      this.dialogVisible = true
      /* 加载分类时级联选择器 */
      http({
        url: '/categories?type=2',
      })
        .then((result) => {
          console.log(result.data)
          this.cateData = result.data
        })
        .catch((err) => {
          console.warn(err)
        })
    },

    /* 提交添加数据 */
    submitAdd() {
      this.$refs.add.validate((valid) => {
        if (valid) {
          http({
            url: '/categories',
            method: 'post',
            data: this.add,
          })
            .then(() => {
              this.$message({
                message: '添加成功',
                type: 'success',
              })
              this.hideDialog()
            })
            .catch((err) => {
              console.warn(err)
            })
            .finally(() => {
              this.loaddata()
            })
        } else {
          this.$message.error('填写格式错误, 请重试')
          return false
        }
      })
    },
    /* 父级级联处理 */
    handleChange() {
      // 证明没有选中任何父级分类
      let parentId = this.parent.cat_id
      if (parentId.length === 0) {
        this.add.cat_pid = 0
        this.add.cat_level = 0
      } else {
        // 选中父级分类
        this.add.cat_pid = parentId[parentId.length - 1]
        // 设置分类等级
        this.add.cat_level = parentId.length
      }
    },
    /* 隐藏弹窗 */
    hideDialog() {
      this.dialogVisible = false
    },
    /* dialog的x按钮 */
    handleClose(done) {
      console.log(done)
      this.$confirm('确认关闭？').then(() => {
        done(this.hideDialog)
      })
    },
    // /* 编辑与删除 */
    /* 编辑 */
    handleEdit(ind, data) {
      data.edit = true
      this.input_cat_name = data.cat_name
      this.tableDataRefresh = false
      this.tableDataRefresh = true
      this.$nextTick(() => {
        this.$refs.input.focus()
      })
    },
    /* 提交编辑 */
    blursubmit(tcell) {
      let str = this.input_cat_name.trim()
      if (str.length < 9) {
        /* 验证是否通过 */
        this.$confirm('确认提交修改？')
          .then(async () => {
            let res = await http({
              url: `/categories/${tcell.cat_id}`,
              method: 'put',
              data: {
                cat_name: str,
              },
            })
            console.log(res)
            if (res.meta.msg === '更新成功') {
              tcell.cat_name = res.data.cat_name
              this.$message({
                message: res.meta.msg,
                type: 'success',
              })
              this.dialogVisible = false //弹窗添加
              this.loaddata()
            } else {
              this.$message({
                message: res.meta.msg,
                type: 'error',
              })
            }
          })
          .catch((err) => {
            console.warn(err)
          })
      } else {
        this.$message({
          message:
            tcell.cat_name === str
              ? str.length == 0
                ? '分类名称不能为空'
                : '分类名称格式不符'
              : '分类名称未修改',
          type: 'warning',
        })
      }
    },
    /* 删除 */
    handleDelete(data) {
      http({
        url: `/categories/${data.cat_id}`,
        method: 'delete',
      })
        .then((result) => {
          console.log(result)
          result.meta.msg.search(/成功/) &&
            this.$message({
              message: '删除成功',
              type: 'success',
            })
        })
        .catch((err) => {
          console.warn(err)
        })
        .finally(() => {
          this.loaddata()
        })
    },
  },
  created() {
    this.loaddata()
  },

  computed: {
    editable() {
      return function () {}
    },
  },
}
</script>

<style scoped lang="scss">
.mainwrapper ::v-deep {
  background-color: #fff;
  padding: 20px;
  .cell {
    display: flex;
    align-items: center;
  }
  .el-table {
    margin: 16px 0;
    .el-table__expand-icon {
      .el-icon-arrow-right {
        border: 1px solid #c3c3c3;
        color: #c3c3c3;
        text-align: center;
        &::before {
          vertical-align: -1px;
          content: '\e6d9';
        }
      }
      &.el-table__expand-icon--expanded {
        transform: none;
        .el-icon-arrow-right {
          &::before {
            content: '\e6d8';
          }
        }
      }
    }
  }
  .el-button--mini {
    margin-right: 20px;
  }
}
</style>
