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
      <!-- 搜索框 -->
      <div class="me_list">
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
      </div>
      <el-table :data="tableData" border style="width: 88%">
        <el-table-column prop="order_id" label="#" width="80">
        </el-table-column>
        <el-table-column prop="order_number" label="订单编号" width="360">
        </el-table-column>
        <el-table-column prop="order_price" label="订单价格" width="120">
        </el-table-column>
        <el-table-column prop="pay_status" label="是否付款" width="160">
          <el-tag type="danger" v-if="this.chan.pay_status == 0">未付款</el-tag>
          <el-tag type="success" v-else>已付款</el-tag>
        </el-table-column>
        <el-table-column prop="is_send" label="是否发货" width="160">
        </el-table-column>
        <el-table-column prop="update_time" label="下单时间" width="295">
          <template slot-scope="scope">
            {{ scope.row.update_time | forTime }}
          </template>
        </el-table-column>
        <!-- 各种增删改删 -->
        <el-table-column label="操作" width="250">
          <template slot-scope="scope">
            <!-- 修改地址 -->
            <el-button
              type="primary"
              icon="el-icon-edit"
              size="mini"
              @click="handleEdit(scope.$index, scope.row)"
            ></el-button>
            <!-- 查看物流 -->
            <el-button
              size="mini"
              type="success"
              icon="el-icon-location-outline"
              @click="handlocation(scope.$index, scope.row)"
              class="remove_"
            ></el-button>
            <!-- 查看订单详情 -->
            <el-button
              size="mini"
              type="warning"
              icon="el-icon-chat-dot-square"
              @click="handlesquare(scope.$index, scope.row)"
            ></el-button>
            <!-- 修改订单信息 -->
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
    <!-- 点击查看信息弹出的框 -->
    <div>
      <el-dialog
        title="查看订单详情"
        width="40%"
        :visible.sync="dialogTableVisible"
      >
        <div class="user_">
          <p><span>订单编号：</span> {{ chan.order_number }}</p>
          <p><span>订单价格：</span> {{ chan.order_price }}</p>
          <p><span>是否付款：</span> {{ chan.pay_status }}</p>
          <p><span>是否发货：</span> {{ chan.is_send }}</p>
          <p><span>下单时间：</span> {{ chan.update_time }}</p>
          <p><span>地点：</span> {{ chan.consignee_addr }}</p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="chan_ye()">确 定</el-button>
          <el-button @click="remo_no()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 点击修改订单详情 -->
    <div>
      <el-dialog
        title="修改订单详情"
        width="40%"
        :visible.sync="dialogTableVisible2"
      >
        <div class="change_page">
          <p>
            <span>订单编号：</span>
            <el-input
              placeholder="请输入内容"
              v-model="chan.order_number"
              clearable
            >
            </el-input>
          </p>
          <p>
            <span>订单价格：</span>
            <el-input
              placeholder="请输入内容"
              v-model="chan.order_price"
              clearable
            >
            </el-input>
          </p>
          <p>
            <span>是否付款：</span>
            <el-input
              placeholder="请输入内容"
              v-model="chan.pay_status"
              clearable
            >
            </el-input>
          </p>
          <p>
            <span>是否发货：</span>
            <el-input placeholder="请输入内容" v-model="chan.is_send" clearable>
            </el-input>
          </p>
          <p>
            <span>下单时间：</span>
            <el-input
              placeholder="请输入内容"
              v-model="chan.update_time"
              clearable
            >
            </el-input>
          </p>
          <p>
            <span>发货地址：</span>
            <el-input
              placeholder="请输入内容"
              v-model="chan.consignee_addr"
              clearable
            >
            </el-input>
          </p>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="chang_page_ye()">确 定</el-button>
          <el-button @click="chang_page_no()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 点击修改地址 -->
    <div>
      <el-dialog
        title="修改地址"
        width="40%"
        :visible.sync="dialogTableVisible3"
      >
        <!-- :value="city"
            @change="changeProvince" -->
        <div class="addres_le">
          <span>省市区/县 </span>
          <el-cascader
            class="in_"
            :options="cityOptions"
            change-on-select
            v-model="a"
            aria-placeholder="请选择"
          >
          </el-cascader>
        </div>
        <div class="addres_">
          <span>详细地址</span>
          <el-input
            class="inn_"
            placeholder="请输入详细地址"
            v-model="input2"
            clearable
          >
          </el-input>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="chang_addre_ye()">确 定</el-button>
          <el-button @click="chang_addre_no()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 点击查看物流信息 -->
    <div>
      <el-dialog
        title="查看物流信息"
        width="40%"
        :visible.sync="dialogTableVisible4"
      >
        <div class="block">
          <el-timeline>
            <el-timeline-item
              v-for="(activity, index) in activities"
              :key="index"
              :timestamp="activity.time"
              :color="color"
              :icon="icon"
              :size="size"
            >
              {{ activity.context }}
            </el-timeline-item>
          </el-timeline>
        </div>
        <span slot="footer" class="dialog-footer">
          <el-button type="primary" @click="chang_food_ye()">确 定</el-button>
          <el-button @click="chang_food_no()">取 消</el-button>
        </span>
      </el-dialog>
    </div>
    <!-- 底部页数设置 -->
    <div class="message_page">
      <el-pagination
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
        :current-page="pagenum"
        :page-sizes="[2, 5, 8, 10]"
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
import cityOptions from "../../assets/js/city_data2017_element.js";
export default {
  props: {},
  data() {
    return {
      tableData: [], //渲染的列表
      pagenum: 1,
      pagesize: 5,
      total: null,
      query: null,
      dialogTableVisible: false,
      dialogTableVisible2: false,
      dialogTableVisible3: false,
      dialogTableVisible4: false,
      cityOptions: cityOptions,
      id: null,
      icon: "el-icon-check",
      color: "#0bbd87",
      size: "large",
      activities: [], //物流进度
      a: "",
      input2: "",
      chan: {
        order_number: "",
        order_price: "",
        pay_status: "",
        is_send: "",
        update_time: "",
        consignee_addr: "",
      },
    };
  },
  methods: {
    //封装加载方法
    axios_s() {
      http({
        url: `/orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        // console.log(res);
        if (res.meta.status !== 200) {
          return this.$message.error("查询用户列表失败！");
        }
        this.tableData = res.data.goods;
        this.total = res.data.total;
      });
    },
    //查询商品
    getUserList() {
      http({
        url: `/orders?query=${this.query}&pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        console.log(res);
        this.tableData = this.tableData.filter((item, index) => {
          if (item.order_number == res.data.goods[index].order_number) {
            this.tableData = res.data.goods;
            return item;
          }
        });
        // this.axios_s()
      });
    },
    //点击各种操作按钮
    //修改地址
    handleEdit(index, row) {
      console.log(index, row);
      this.dialogTableVisible3 = true;
    },
    chang_addre_ye() {
      this.chan.consignee_addr = this.a + this.input2;
      // http({
      //   url: `/orders/${this.id}`,
      //   method: "put",
      //   data: {
      //      is_send: this.chan.is_send,
      //     // order_pay:this.chan.order_pay,
      //     order_price: this.chan.order_price,
      //     order_number: this.chan.order_number,
      //     pay_status: this.chan.pay_status,
      //     consignee_addr: this.chan.consignee_addr,
      //   },
      // }).then((res) => {
      //   console.log(res);
      //   if (res.meta.status !== 201) {
      //     return this.$message.error("更改信息失败！");
      //   }
      //   this.$message({
      //     message: res.meta.msg,
      //     type: "success",
      //   });
      // });
      this.axios_s();
      this.dialogTableVisible3 = false;
    },
    chang_addre_no() {
      this.dialogTableVisible3 = false;
    },
    //查看物流信息
    handlocation(index, row) {
      console.log(index, row);
      this.dialogTableVisible4 = true;
    },
    chang_food_ye() {
      this.dialogTableVisible4 = false;
    },
    chang_food_no() {
      this.dialogTableVisible4 = false;
    },
    //订单详情
    handlesquare(index, row) {
      console.log(index, row);
      this.id = row.order_id;
      this.chan.order_number = row.order_number;
      this.chan.order_price = row.order_price;
      // this.chan.pay_status = row.pay_status;
      this.chan.is_send = row.is_send;
      this.chan.update_time = new Date(row.update_time)
        .toLocaleString("chinese", { hour12: false })
        .replaceAll("/", "-");
      this.chan.consignee_addr = row.consignee_addr;
      this.dialogTableVisible = true;
    },
    chan_ye() {
      this.dialogTableVisible = false;
    },
    remo_no() {
      this.dialogTableVisible = false;
    },
    //修改订单信息
    handleoutline(index, row) {
      console.log(index, row);
      this.id = row.order_id;
      this.chan.order_number = row.order_number;
      this.chan.order_price = row.order_price;
      this.chan.pay_status = row.pay_status;
      this.chan.is_send = row.is_send;
      this.chan.update_time = new Date(row.update_time)
        .toLocaleString("chinese", { hour12: false })
        .replaceAll("/", "-");
      this.chan.consignee_addr = row.consignee_addr;
      this.dialogTableVisible2 = true;
    },
    chang_page_ye() {
      http({
        url: `/orders/${this.id}`,
        method: "put",
        data: {
          is_send: this.chan.is_send,
          // order_pay:this.chan.order_pay,
          order_price: this.chan.order_price,
          order_number: this.chan.order_number,
          pay_status: this.chan.pay_status,
          consignee_addr: this.chan.consignee_addr,
        },
      }).then((res) => {
        console.log(res);
        if (res.meta.status !== 201) {
          return this.$message.error("更改信息失败！");
        }
        this.$message({
          message: res.meta.msg,
          type: "success",
        });
        this.axios_s();
        this.dialogTableVisible2 = false;
      });
    },
    chang_page_no() {
      this.dialogTableVisible2 = true;
    },
    //底部页数设置
    handleSizeChange(val) {
      this.pagesize = parseInt(`${val}`);
      http({
        url: `/orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        this.tableData = res.data.goods;
        this.total = res.data.total;
      });
    },
    handleCurrentChange(val) {
      this.pagenum = parseInt(`${val}`);
      http({
        url: `/orders?pagenum=${this.pagenum}&pagesize=${this.pagesize}`,
      }).then((res) => {
        this.tableData = res.data.goods;
        this.total = res.data.total;
      });
    },
  },
  // 修改时间戳
  filters: {
    forTime(time_) {
      // console.log(time_);
      return new Date(time_)
        .toLocaleString("chinese", { hour12: false })
        .replaceAll("/", "-");
    },
  },
  components: {},
  mounted() {
    this.axios_s();
    http({
      url: "/kuaidi/1106975712662",
    }).then((res) => {
      this.activities = res.data.data;
      console.log(this.activities);
    });
  },
};
</script>

<style scoped lang="scss">
.message_list {
  padding: 30px;
  background-color: white;
  .me_list {
    width: 500px;
    margin-bottom: 15px;
    .el_input {
      width: 300px;
      margin-right: 50px;
    }
  }
}
.message_page {
  background-color: white;
  padding: 0 30px 30px 30px;
}
.user_ {
  p {
    margin-bottom: 20px;
  }
  span {
    display: inline-block;
    width: 70px;
    text-align: right;
  }
}
.change_page {
  p {
    display: flex;
    margin-bottom: 30px;
    align-items: center;
    span {
      width: 120px;
    }
  }
}
.in_ {
  width: 400px;
}
.addres_ {
  margin-top: 50px;
  span {
    width: 120px;
  }
  .inn_ {
    width: 400px;
  }
  align-items: center;
  display: flex;
}
.addres_le {
  span {
    margin-right: 55px;
  }
}
</style>
