<template>
  <div class="all data">
    <el-form label-width="100px" class="demo-ruleForm" label-position="top">
      <el-form-item
        v-for="item in data.slice(0, 3)"
        :key="item.label"
        :label="item.label"
        :props="item.value"
        :rules="[{required: true, message: `请填写${item.label}`, trigger: 'blur'}]"
      >
        <el-input v-model="item.value" @input="demo(item.value)"></el-input>
      </el-form-item>

      <el-form-item :label="data[4].label">
        <el-cascader
          placeholder="请选择"
          v-model="data[4].value"
          :options="cateList"
          :props="{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
          }"
          clearable
          @change="handleChange()"
          getCheckedNodes
        ></el-cascader>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '../../../http'
export default {
  components: {},
  data() {
    return {
      item:'',
      cateList: [],
      data: [
        { label: '商品名称', name: 'goods_name', value: '' },
        { label: '商品价格', name: 'goods_price', value: '' },
        { label: '商品重量', name: 'goods_weight', value: '' },
        { label: '商品数量', name: 'goods_number', value: '' },
        { label: '商品分类', name: 'goods_cat', value: [] },
      ],
    }
  },
  beforeCreate() {
    /* 获取分类类名 */
    http('/categories?type=3')
      .then((result) => {
        console.log(result)
        this.cateList = result.data
      })
      .catch((err) => {
        console.warn(err)
      })
  },
  methods: {
    demo(a) {
      console.log(a)

      return a
    },
    handleChange(){
      console.log(this.data[4].value);
      
    }
  },
}
</script>

<style lang="scss" scoped>
.step1 {
  margin: 0 auto;
}
</style>
