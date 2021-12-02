<template>
  <div class="all step1">
    <el-form
      label-width="100px"
      class="demo-ruleForm"
      ref="form"
      label-position="top"
    >
      <el-form-item
        :label="item.attr_name"
        prop="goods_number"
        v-for="item in manyData"
        :key="item.attr_id"
      >
        <!--复选框组-->
        <el-checkbox-group
          v-if="Array.isArray(item.attr_vals)"
          v-model="item.attr_vals"
        >
          <el-checkbox
            v-for="(cb, i) in item.attr_vals"
            :label="cb"
            :key="i"
            border
            size="small"
          ></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '../../../http'
export default {
  components: {},
  props: ['id', 'activeName'],
  data() {
    return {
      manyData: [],
    }
  },
  methods: {},
  watch: {
    id() {
      if (this.id) {
        http({
          url: `/categories/${this.id}/attributes`,
          params: {
            sel: 'many',
          },
        })
          .then((result) => {
            console.log(result)
            result.data.forEach((item) => {
              item.attr_vals =
                item.attr_vals.trim().length === 0
                  ? []
                  : item.attr_vals.trim().split(/\s+/)
            })
            this.manyData = result.data
          })
          .catch((err) => {
            console.warn(err)
          })
      }
    },
    activeName() {
      console.log(this.manyData)
      this.$emit('getstep1', this.manyData)
    },
  },
}
</script>

<style lang="scss" scoped>
.step1 {
  margin: 0 auto;
}
</style>
