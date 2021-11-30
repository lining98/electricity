<template>
  <div class="all addgood">
    <el-breadcrumb separator-class="el-icon-arrow-right">
      <el-breadcrumb-item :to="{ path: '/' }">首页</el-breadcrumb-item>
      <el-breadcrumb-item>商品管理</el-breadcrumb-item>
      <el-breadcrumb-item>添加商品</el-breadcrumb-item>
    </el-breadcrumb>
    <div class="mainwrapper">
      <el-alert title="添加商品信息" type="info" center show-icon> </el-alert>
      <el-steps
        :space="200"
        :active="+activeName"
        finish-status="success"
        align-center
      >
        <el-step title="基本信息"></el-step>
        <el-step title="商品参数"></el-step>
        <el-step title="商品属性"></el-step>
        <el-step title="商品图片"></el-step>
        <el-step title="商品内容"></el-step>
        <el-step title="完成"></el-step>
      </el-steps>
      <el-tabs
        tab-position="left"
        v-model="activeName"
        :before-leave="beforeTabLeave"
      >
        <el-tab-pane label="基本信息" name="0"
          ><step0 @getdata="stepdata0"></step0
        ></el-tab-pane>
        <el-tab-pane label="商品参数" name="1"
          ><step1 @getdata="stepdata1"></step1
        ></el-tab-pane>
        <el-tab-pane label="商品属性" name="2"
          ><step2 @getdata="stepdata2"></step2
        ></el-tab-pane>
        <el-tab-pane label="商品图片" name="3"
          ><step3 @getdata="stepdata3"></step3
        ></el-tab-pane>
        <el-tab-pane label="商品内容" name="4"
          ><step4 @getdata="stepdata4"></step4
        ></el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>

<script>
import step0 from './addshop/step0.vue'
import step1 from './addshop/step0.vue'
import step2 from './addshop/step2.vue'
import step3 from './addshop/step3.vue'
import step4 from './addshop/step4.vue'
export default {
  components: { step0, step1, step2, step3, step4 },
  data() {
    return {
      activeName: 0,
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
        goods_cat: [
          { required: true, message: '请选择商品分类', trigger: 'blur' },
        ],
      },
    }
  },
  methods: {
    stepdata0(value) {
      console.log(value)
    },
    stepdata1(value) {
      console.log(value)
    },
    stepdata2(value) {
      console.log(value)
    },
    stepdata3(value) {
      console.log(value)
    },
    stepdata4(value) {
      console.log(value)
    },
    beforeTabLeave() {
      console.log('beforeTabLeave')
    },
  },
}
</script>

<style lang="scss" scoped>
.addgood {
  margin: 0 auto;
}
</style>
goods_name: [{ required: true, message: '请填写商品名称', trigger: 'blur' }],
goods_price: [{ required: true, message: '请填写商品价格', trigger: 'blur' }],
goods_weight: [{ required: true, message: '请填写商品重量', trigger: 'blur' }],
goods_number: [{ required: true, message: '请填写商品数量', trigger: 'blur' }],
goods_cat: [{ required: true, message: '请选择商品分类', trigger: 'blur' }]
