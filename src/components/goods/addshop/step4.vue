<template>
  <div class="all step4">
    <!--富文本编辑器组件-->

    <quill-editor
      v-if="addForm"
      v-model="addForm.goods_introduce"
    ></quill-editor>
    <!--添加商品按钮-->
    <el-button type="primary" @click="addGoods" class="btnAdd">
      添加商品
    </el-button>
  </div>
</template>

<script>
import http from '../../../http'
export default {
  props: ['addForm'],
  components: {},
  methods: {
    addGoods() {
      let { id, cat_id, ...rest } = this.addForm
      console.log(cat_id)
      http({
        url: '/goods',
        method: 'post',
        data: {
          ...rest,
          goods_cat: id,
        },
      })
        .then((res) => {
          let flag = /成功/.test(res.meta.msg)
          this.$message({
            message: flag ? res.meta.msg : '已存在该名字的商品',
            type: flag ? 'success' : 'error',
          })
          this.$router.push('/home/goods')
        })
        .catch((err) => {
          console.warn(err)
        })
    },
  },
}
</script>

<style lang="scss" scoped>
.step4 ::v-deep {
  margin: 0 auto;
  width: 100%;
  .ql-editor {
    min-height: 300px;
  }
  .el-button {
    margin: 20px 0;
  }
}
</style>
