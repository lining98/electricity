<template>
  <div>
    <!-- 面包屑 -->
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>订单管理</el-breadcrumb-item>
      <el-breadcrumb-item>订单列表</el-breadcrumb-item>
    </el-breadcrumb>
    <!-- 订单列表 -->
    <div class="message_list">
    <el-table :data="tableData" border style="width: 100%">
      <el-table-column prop="order_id" label="#" width="80"> </el-table-column>
      <el-table-column prop="order_number" label="订单编号" width="360">
      </el-table-column>
      <el-table-column prop="order_price" label="订单价格" width="120">
      </el-table-column>
      <el-table-column  label="是否付款" width="160">
        <el-tag type="danger">未付款</el-tag>
      </el-table-column>
      <el-table-column prop="is_send" label="是否发货" width="160">
      </el-table-column>
      <el-table-column prop="update_time" label="下单时间" width="280">
      </el-table-column>
      <el-table-column  label="操作"> 
        <template slot-scope="scope">
          <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="danger"
              icon="el-icon-location-outline"
              @click="handlocation(scope.row.id)"
              class="remove_"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-chat-dot-square"
              @click="handlesquare(scope.$index, scope.row)"
            ></el-button>
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-edit-outline"
              @click="handleoutline(scope.$index, scope.row)"
            ></el-button>
        </template>
      </el-table-column>
    </el-table>
    </div>
  </div>
</template>

<script>
import http from "@/http";
export default {
  props: {},
  data() {
    return {
      tableData: [],
      pagenum:1,
      pagesize:5,
      total:null
    };
  },
  methods: {
    //封装加载方法
    axios_s() {
      http({
        url: `/orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户列表失败！");
        }
        this.tableData = res.data.goods;
        this.total = res.data.total;
      });
    },
    //点击各种操作按钮
    //修改地址
    handleEdit(index,row){
      console.log(index,row);
    },
    //查看物流信息
    handlocation(index,row){
      console.log(index,row);
    },
    //订单详情
    handlesquare(index,row){
      console.log(index,row);
    },
    //修改订单状态
    handleoutline(index,row){
      console.log(index,row);
    },

  },
  components: {},
  mounted() {
    this.axios_s()
  },
};
</script>

<style scoped lang="scss">
</style>
