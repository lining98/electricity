<template>
  <div class="all step3">
    <!-- 添加商品图片 -->

    <!--上传组件-->
    <!--action 表示图片要上传到的后台API地址-->
    <el-upload
      action="http://192.168.1.61:8888/api/private/v1/upload"
      :headers="headerObj"
      :on-preview="handlePreview"
      :on-remove="handleRemove"
      :on-success="handleSuccess"
      list-type="picture"
    >
      <el-button size="small" type="primary">点击上传</el-button>
    </el-upload>
  </div>
</template>

<script>
export default {
  props: ['activeName'],
  data() {
    return {
      fileList: [],
      url: 'http://127.0.0.1:8888/api/private/v1/upload',
      headerObj: {
        Authorization: window.sessionStorage.getItem('token'),
      },
    }
  },
  methods: {
    handlePreview(file) {
      console.log(file)
    },
    beforeRemove(file) {
      return this.$confirm(`确定移除 ${file.name}？`)
    },
    handleSuccess(res) {
      this.$message({ message: '添加成功', type: 'success' })
      this.fileList.push(res.data.tmp_path)
    },
    handleRemove() {},
  },
  watch: {
    fileList(newv) {
      console.log(newv)
    },
    activeName() {
      this.$emit('getstep3', { pics: this.fileList })
    },
  },
}
</script>

<style lang="scss" scoped>
.step3 {
  margin: 0 auto;
}
</style>
