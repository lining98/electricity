<template>
  <div>
    <!-- 编辑框弹窗 -->
    <el-dialog
      title="编辑商品"
      :visible.sync="editDialogVisible"
      width="50%"
      @close="editClose"
    >
      <el-form
        :model="editForm"
        :rules="editFormRules"
        ref="editForm"
        label-width="90px"
      >
        <el-form-item label="商品名称" prop="goods_name">
          <el-input v-model="editForm.goods_name"></el-input>
        </el-form-item>
        <el-form-item label="商品价格" prop="goods_price">
          <el-input v-model="editForm.goods_price"></el-input>
        </el-form-item>
        <el-form-item label="商品数量" prop="goods_number">
          <el-input v-model="editForm.goods_number"></el-input>
        </el-form-item>
        <el-form-item label="商品重量" prop="goods_weight">
          <el-input v-model="editForm.goods_weight"></el-input>
        </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="editDialogVisible = false">取 消</el-button>
        <el-button type="primary" @click="editSubmit">确 定</el-button>
      </span>
    </el-dialog>
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>商品列表</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mainwrapper">
      <div class="searchwrapper">
        <el-input
          placeholder="请输入内容"
          v-model="req.query"
          class="inputSearch"
        >
          <el-button
            class="querybtn"
            slot="append"
            icon="el-icon-search"
            @click="loaddata"
          ></el-button>
        </el-input>
        <el-button class="addshop" type="primary" @click="addshopbtn">
          添加商品
        </el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="#" prop="id" type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          min-width="280px"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间">
          <template slot-scope="scope">
            {{
              new Date(scope.row.add_time)
                .toLocaleString('zh-CN', { hour12: false })
                .replaceAll('/', '-')
            }}
          </template>
        </el-table-column>
        <!-- 操作列 -->
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.row)"
            ></el-button>
            <el-button
              type="danger"
              icon="el-icon-delete"
              size="mini"
              @click="handleDelete(scope.row)"
            ></el-button>
          </template>
        </el-table-column>
      </el-table>
      <!-- 分页器 -->
      <div class="block">
        <el-pagination
          @size-change="handleSizeChange"
          @current-change="handleCurrentChange"
          background
          :current-page="req.pagenum"
          :page-sizes="[5, 10, 20]"
          :page-size="req.pagesize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="totalPage"
          :page-count="8"
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
      //编辑框是否显示
      editDialogVisible: false,
      //编辑框参数
      editForm: {
        goods_id: '',
        goods_name: '',
        goods_price: null,
        goods_number: null,
        goods_weight: null,
        goods_cat: '',
      },
      // 编辑商品的验证规则对象
      editFormRules: {
        goods_name: [
          { required: true, message: '请输入商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请输入商品价格', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请输入商品数量', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请输入商品重量', trigger: 'blur' },
        ],
      },
      total: null,
      tableData: [],
      totalPage: null,
      req: {
        query: '',
        pagesize: 10,
        pagenum: 1,
      }, //请求数据
    }
  },
  methods: {
    /* 加载数据 及查询*/
    loaddata() {  
      http({
        url: '/goods',
        params: this.req,
      })
        .then((result) => {
          this.tableData = result.data.goods
          this.totalPage = result.data.total
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
    // 页面条数改变
    handleSizeChange(val) {
      if (this.req.pagesize === val) return
      this.req.pagesize = val
      this.loaddata()
    },
    /* 添加按钮 */
    addshopbtn() {
      this.$router.push('/home/addgoods')
    },
    /* 删除按钮 */
    handleDelete(shop) {
      this.$confirm('此操作将永久删除该商品, 是否继续?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning',
      })
        .then(() => {
          http({
            url: '/goods/' + shop.goods_id,
            method: 'delete',
          }).then((res) => {
            console.log(res)
            if (res.meta.status === 200) {
              this.$message({
                type: 'success',
                message: res.meta.msg,
              })
              this.loaddata()
            }
          })
        })
        .catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除',
          })
        })
    },
    /* 编辑按键 */
    handleEdit(shop) {
      this.editDialogVisible = true
      console.log(shop)
      let { goods_id, goods_name, goods_price, goods_number, goods_weight } =
        shop
      http('/goods/' + goods_id)
        .then((res) => {
          console.log(res)
          let { goods_cat } = res.data
          this.editForm = {
            goods_id,
            goods_name,
            goods_price,
            goods_number,
            goods_weight,
            goods_cat,
          }
        })
        .catch((err) => {
          console.warn(err)
        })
    },
    /* 编辑关闭按钮 */
    editClose() {
      this.editDialogVisible = false
    },
    /* 编辑提交按钮 */
    editSubmit() {
      this.$refs.editForm.validate((valid) => {
        if (!valid) {
          return this.$message.error('请填写必要的表单项')
        }
        let { goods_id, ...rest } = this.editForm
        http({
          method: 'put',
          url: '/goods/' + goods_id,
          data: rest,
        })
          .then((res) => {
            console.log(res)
            if (res.meta.status === 200) {
              this.$message({
                message: '修改成功',
                type: 'success',
              })
            } else {
              this.$message({
                message: '修改失败, ' + res.meta.msg,
                type: 'error',
              })
            }
            this.editDialogVisible = false
            this.loaddata()
          })
          .catch((err) => {
            console.warn(err)
          })
      })
    },
  },
  components: {},
  mounted() {
    this.loaddata()
  },
}
</script>

<style scoped lang="scss">
.mainwrapper ::v-deep {
  background-color: #fff;
  padding: 20px;
  .searchwrapper {
    display: flex;
    width: 40%;
    margin-bottom: 15px;
    .el-input-group__append {
      background-color: #f5f7fa;
    }
    .addshop {
      margin-left: 20px;
    }
  }
  div.cell {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  /* 序号居中 */
  [type='index'] {
    .cell {
      overflow: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      div {
        text-align: center;
      }
    }
  }
  .block {
    margin-top: 16px;
  }
}
</style>
