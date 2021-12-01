<template>
  <div class="all step0">
    <el-form
      :model="formData"
      :rules="addFormRules"
      label-width="100px"
      class="ruleForm"
      ref="form"
      label-position="top"
    >
      <el-form-item label="商品名称" prop="goods_name">
        <el-input v-model="formData.goods_name"></el-input>
      </el-form-item>
      <el-form-item label="商品价格" prop="goods_price">
        <el-input v-model="formData.goods_price"></el-input>
      </el-form-item>
      <el-form-item label="商品重量" prop="goods_weight">
        <el-input v-model="formData.goods_weight"></el-input>
      </el-form-item>
      <el-form-item label="商品数量" prop="goods_number">
        <el-input v-model="formData.goods_number"></el-input>
      </el-form-item>
      <el-form-item label="商品分类" prop="cat_id">
        <el-cascader
          placeholder="请选择"
          v-model="cat_id"
          :options="cateList"
          :props="{
            expandTrigger: 'hover',
            value: 'cat_id',
            label: 'cat_name',
          }"
          clearable
          @change="handleChange"
          getCheckedNodes
        ></el-cascader>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import http from '../../../http'
export default {
  props: ['formData'],
  components: {},
  data() {
    return {
      item: '',
      cateList: [],
      cat_id: [],
      addFormRules: {
        goods_name: [
          { required: true, message: '请填写商品名称', trigger: 'blur' },
        ],
        goods_price: [
          { required: true, message: '请填写商品价格', trigger: 'blur' },
        ],
        goods_weight: [
          { required: true, message: '请填写商品重量', trigger: 'blur' },
        ],
        goods_number: [
          { required: true, message: '请填写商品数量', trigger: 'blur' },
        ],
        cat_id: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
    }
  },
  beforeCreate() {
    /* 获取分类类名 */
    http('/categories?type=3')
      .then((result) => {
        this.cateList = result.data
      })
      .catch((err) => {
        console.warn(err)
      })
  },
  methods: {
    handleChange() {
      if (this.cat_id.length === 3) {
        this.formData.cat_id = this.cat_id[2]
        this.formData.id=this.cat_id.join(',')
      }      
    },
  },
}
</script>

<style lang="scss" scoped></style>
