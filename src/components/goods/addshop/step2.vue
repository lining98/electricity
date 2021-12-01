<template>
  <div class="all step2">
    <el-form
      label-width="100px"
      class="demo-ruleForm"
      ref="form"
      label-position="top"
    >
      <el-form-item
        v-for="item in onlyData"
        :label="item.attr_name"
        prop="goods_number"
        :key="item.attr_id"
      >
        <el-input type="text" v-model="item.attr_vals" />
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '../../../http'
export default {
  components: {},
  props: ['id','activeName'],
  data() {
    return {
      onlyData: [],
    }
  },
  methods: {},
  watch: {
    id() {
      if (this.id) {
        http({
          url: `/categories/${+this.id}/attributes`,
          params: {
            sel: 'only',
          },
        })
          .then((result) => {
            console.log(result)
            this.onlyData = result.data
          })
          .catch((err) => {
            console.warn(err)
          })
      }
    },
    activeName() {
			console.log(this.onlyData);		
      this.$emit('getstep2', this.onlyData)
    },
  },
}
</script>

<style lang="scss" scoped>
.step2 {
  margin: 0 auto;
}
</style>
