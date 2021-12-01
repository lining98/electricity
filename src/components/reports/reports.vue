<template>
  <div class="reports">
    <p class="path"><span>首页</span> &gt; 权限管理 &gt; 角色列表</p>
    <div id="main"></div>
  </div>
</template>

<script>
import http from "@/http";
import * as echarts from "echarts";

export default {
  props: {},
  data() {
    return {
      options: {
        title: {
          text: "用户来源",
        },
        tooltip: {
          trigger: "axis",
          axisPointer: {
            type: "cross",
            label: {
              backgroundColor: "#E9EEF3",
            },
          },
        },
        grid: {
          left: "3%",
          right: "4%",
          bottom: "3%",
          containLabel: true,
        },
        xAxis: [
          {
            boundaryGap: false,
          },
        ],
        yAxis: [
          {
            type: "value",
          },
        ],
      },
    };
  },
  methods: {},
  mounted() {
    var myChart = echarts.init(document.getElementById("main"));

    http({
      url: "reports/type/1",
    }).then((res) => {
      console.log(res);
      if (res.meta.status !== 200) {
        return this.$message.error("初始化折线图失败！");
      }
      // console.log(res.data);
      const data = { ...this.options, ...res.data };
      // const data = Object.assign(this.options, res.data);
      // 使用指定的配置项和数据显示图表。
      myChart.setOption(data);
    });
  },
  components: {},
};
</script>

<style scoped lang="scss">
.reports {
  .path {
    font-size: 14px;
    span {
      font-weight: bold;
    }
  }
}
#main {
  margin-top: 15px;
  background-color: #fff;
  width: 100%;
  height: 500px;
  padding: 30px 25px;
  box-sizing: border-box;
}
</style>
