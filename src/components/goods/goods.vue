<template>
  <div>
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
          ></el-button>
        </el-input>
        <el-button class="addshop" type="primary" @click="addshopbtn">添加商品</el-button>
      </div>
      <el-table :data="tableData" style="width: 100%" border>
        <el-table-column label="#" prop="id" type="index"></el-table-column>
        <el-table-column
          label="商品名称"
          prop="goods_name"
          min-width="400px"
        ></el-table-column>
        <el-table-column
          label="商品价格(元)"
          prop="goods_price"
        ></el-table-column>
        <el-table-column label="商品重量" prop="goods_weight"></el-table-column>
        <el-table-column label="创建时间" prop="add_time"></el-table-column>
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
  props: {},
  data() {
    return {
      total: null,
      tableData: [],
      totalPage: null,
      req: {
        query: '',
        pagesize: 10,
        pagenum: 1,
      },
    }
  },
  methods: {
    /* 加载数据函数 */
    loaddata() {
      http({
        url: '/goods',
        params: this.req,
      })
        .then((result) => {
          console.log(result)
          ;({ goods: this.tableData, total: this.totalPage } = result.data)
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
    handleSizeChange(val) {
      if (this.req.pagesize === val) return
      this.req.pagesize = val
      this.loaddata()
    },
    addshopbtn(){
      this.$router.push('/home/addgoods')
    }
  },
  components: {},
  created() {
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
