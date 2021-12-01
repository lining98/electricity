<template>
  <div class="rights">
    <p class="path"><span>首页</span> &gt; 权限管理 &gt; 权限列表</p>
    <div class="wrap">
      <el-table :data="rightList" style="width: 100%" border stripe>
        <el-table-column label="#" type="index" width="50"> </el-table-column>
        <el-table-column label="权限名称" prop="authName"> </el-table-column>
        <el-table-column label="路径" prop="path"> </el-table-column>
        <el-table-column label="权限等级">
          <template slot-scope="scope">
            <el-tag size="small" v-if="scope.row.level == 0">一级</el-tag>
            <el-tag type="success" size="small" v-else-if="scope.row.level == 1"
              >二级</el-tag
            >
            <el-tag type="warning" size="small" v-else>三级</el-tag>
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
      rightList: [],
    };
  },
  mounted() {
    // 列表显示权限
    http({
      url: "rights/list",
    }).then((res) => {
      if (res.meta.status !== 200) {
        return this.$message.error("获取权限列表失败！");
      } else {
        this.rightList = res.data;
      }
    });
  },
  methods: {},
  components: {},
};
</script>

<style scoped lang="scss">
.rights {
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
    padding: 35px 20px;
    box-sizing: border-box;
    .list {
      border: 1px solid #ebeef5;
      .title {
        color: #909399;
        height: 47px;
      }
      li {
        height: 52px;
        display: flex;
        color: #606266;
        align-items: center;
        > span {
          padding-left: 10px;
          display: inline-flex;
          height: 100%;
          align-items: center;
        }
        > span:not(.index) {
          flex: 1;
        }
        > span:not(span:last-child) {
          border-right: 1px solid #ebeef5;
        }

        .index {
          display: inline-flex;
          width: 47px;
          // flex: 0;
        }
      }
      li:nth-child(2n + 3) {
        background-color: #fafafa;
      }
      li:not(li:last-child) {
        border-bottom: 1px solid #ebeef5;
      }
    }
  }
}
</style>
