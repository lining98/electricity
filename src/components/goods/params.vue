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
              }"
              clearable
              @change="handleChange()"
              getCheckedNodes
            >
            </el-cascader>
          </div>
        </el-form-item>
        <el-menu
          :default-active="activeIndex"
          class="el-menu-demo"
          mode="horizontal"
          @select="handleSelect"
          text-color="#333"
          active-text-color="#53A8FF"
        >
          <el-menu-item index="1">动态参数</el-menu-item>
          <el-menu-item index="2">静态属性</el-menu-item>
        </el-menu>
        <div>
          <el-button
            type="primary"
            class="add-param-btn"
            :plain="selectedCate.length < 3"
          >
            添加{{ activeIndex === '2' ? '属性' : '参数' }}
          </el-button>
          <el-table :data="tableData" style="width: 100%" border>
            <el-table-column type="expand" class="expand">
              <template slot-scope="props">
                <div label-position="left" inline class="demo-table-expand">
                  <el-tag
                    :key="tag"
                    v-for="tag in props.row.attr_vals"
                    closable
                    :disable-transitions="false"
                    @close="handleClose(tag)"
                  >
                    {{ tag }}
                  </el-tag>
                  <el-input
                    class="input-new-tag"
                    v-if="inputVisible"
                    v-model="inputValue"
                    ref="saveTagInput"
                    size="small"
                    @keyup.enter.native="handleInputConfirm"
                    @blur="handleInputConfirm"
                  >
                  </el-input>
                  <el-button
                    v-else
                    class="button-new-tag"
                    size="small"
                    @click="showInput"
                  >
                    + New Tag
                  </el-button>
                </div>
              </template>
            </el-table-column>
            <el-table-column label="#" prop="id" type="index"></el-table-column>
            <el-table-column
              :label="activeIndex === '2' ? '属性名称' : '参数名称'"
              prop="attr_name"
            >
            </el-table-column>
            <el-table-column label="操作">
              <template slot-scope="scope">
                <el-button
                  type="primary"
                  icon="el-icon-edit"
                  size="mini"
                  @click="handleEdit(scope.row)"
                >
                  编辑
                </el-button>
                <el-button
                  type="danger"
                  icon="el-icon-delete"
                  size="mini"
                  @click="handleDelete(scope.row)"
                >
                  删除
                </el-button>
              </template>
            </el-table-column>
          </el-table>
        </div>
      </el-form>
    </div>
  </div>
</template>

<script>
import http from '../../http/index'
export default {
  data() {
    return {
      activeIndex: '1', //导航下标
      cateList: [], //级联选择器的可选数据
      tableData: [],
      selectedCate: [],
      add: null,
      inputVisible: false,
      inputValue: '',
    }
  },
  computed: {
    attrType() {
      return this.activeIndex === '1' ? 'many' : 'only'
    },
  },
  methods: {
    /* 获取静态属性或动态参数 */
    handleChange() {
      console.log(this.selectedCate);
      
      if (this.selectedCate.length !== 3) {
        this.$message({
          message: '只允许为第三级分类设置相关参数',
          type: 'warning',
        })
      }
      const id = this.selectedCate[2]
      http({
        url: `/categories/${id}/attributes`,
        params: { sel: this.attrType },
      })
        .then((result) => {
          result.data.forEach((item) => {
            item.attr_vals = item.attr_vals.split(/\s+,?|,?\s+/)
          })
          this.tableData = result.data
        })
        .catch((err) => {
          console.warn(err)
        })
    },
    handleInputConfirm() {
      console.log(this.inputValue)
    },
    handleSelect(index) {
      console.log(index)
      this.activeIndex = index
      this.handleChange()
    },
    showInput() {
      this.inputVisible = true
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
      if (str.length < 5) {
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
            } else {
              this.$message({
                message: res.meta.msg,
                type: 'error',
              })
            }
            delete tcell.edit
            this.tableDataRefresh = false
            this.tableDataRefresh = true
            return
          })
          .catch(() => {
            delete tcell.edit
            this.tableDataRefresh = false
            this.tableDataRefresh = true
            return
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
        delete tcell.edit
        this.tableDataRefresh = false
        this.tableDataRefresh = true
        return
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
          this.$router.go(0)
        })
    },
  },

  beforeCreate() {
    /* 三级分类 */
    http({ url: '/categories?type=3' })
      .then((result) => {
        this.cateList = result.data
      })
      .catch((err) => {
        console.warn(err)
      })
    /* 动态参数与静态属性 */
    http({
      url: `/categories/6/attributes`,
      params: { sel: 'many' },
    })
      .then((result) => {
        result.data.forEach((item) => {
          // 把字符串的可选项，分割为数组，重新赋值给 attr_vals
          item.attr_vals =
            item.attr_vals.length > 0 ? item.attr_vals.split(/\s+,?|,?\s+/) : []
          // 为每个数据行，添加自己的 tagInputVisible ，从而控制自己展开行中的输入框的显示与隐藏
          item.tagInputVisible = false
          // 把文本框中输入的值，双向绑定
          item.tagInputValue = ''
        })
        this.tableData = result.data
        console.log(this.tableData)
      })
      .catch((err) => {
        console.warn(err)
      })
  },
}
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
</style>
