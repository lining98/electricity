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
        :currentName="activeName"
        :before-leave="beforeTabLeave"
      >
        <el-tab-pane label="基本信息" name="0">
          <step0 :formData="step0"></step0>
        </el-tab-pane>
        <el-tab-pane label="商品参数" name="1">
          <step1
            :id="step0.cat_id"
            @getstep1="getstep1"
            :activeName="activeName"
          ></step1>
        </el-tab-pane>
        <el-tab-pane label="商品属性" name="2">
          <step2
            :id="step0.cat_id"
            :activeName="activeName"
            @getstep2="getstep2"
          ></step2>
        </el-tab-pane>
        <el-tab-pane label="商品图片" name="3">
          <step3 :activeName="activeName" @getstep3="getstep3"></step3>
        </el-tab-pane>
        <el-tab-pane label="商品内容" name="4">
          <step4 :addForm="addForm"></step4>
        </el-tab-pane>
      </el-tabs>
    </div>
  </div>
</template>
<script>
import step0 from './addshop/step0'
import step1 from './addshop/step1'
import step2 from './addshop/step2'
import step3 from './addshop/step3'
import step4 from './addshop/step4'
export default {
  components: { step0, step1, step2, step3, step4 },
  data() {
    return {
      step0: {
        cat_id: '',
        goods_name: '',
        goods_price: '',
        goods_weight: '',
        goods_number: '',
      },
      step1: null,
      step2: null,
      step3: null,
      addForm: null,
      activeName: '0',
    }
  },
  methods: {
    beforeTabLeave(to) {
      let bool = true
      if (to === '2' || to === '1') {
        if (!this.step0Finished) {
          this.$message({
            message: '必填项未完成',
            type: 'error',
          })
          this.activeName = '0'
          bool = false
          this.$router.push("/home/goods")
        }
      } else if (to === '4') {
        this.addForm = {
          ...this.step0,
          ...this.step1,
          ...this.step3,
          goods_introduce:'',
        }
        this.addForm.attrs = this.addForm.attrs.concat(this.step2.attrs)
        console.log(this.addForm)
      }
      return bool
    },
    /* 动态属性的获取 */
    getstep1(v) {
      let attrs = []
      v.forEach((item) => {
        let { attr_id, attr_vals } = item
        if (attr_vals.length) {
          let attr_value = attr_vals.join(' ')
          attrs.push({ attr_id, attr_value })
        }
      })
      this.step1 = { attrs }
    },
    /* 静态属性的获取 */
    getstep2(v) {
      let attrs = []
      v.forEach((item) => {
        let { attr_id, attr_vals } = item
        if (attr_vals.trim().length) {
          let attr_value = attr_vals.trim()
          attrs.push({ attr_id, attr_value })
        }
      })
      this.step2 = { attrs }
    },
    /* 图片路径的获取 */
    getstep3(v) {
      console.log(v);
      this.step3 = v
    },
  },
  computed: {
    step0Finished() {
      let arr = Object.values(this.step0).filter((item) => item).length
      return arr >=5 ? true : false
    },
  },
  watch:{
    step0:{
      deep:true,  
      handler(){
        console.log(this.step0);
      }
      
    }
  }
}
</script>

<style lang="scss" scoped>
.addgood {
  margin: 0 auto;
}
.mainwrapper{
  background-color: #fff;
  padding: 20px;
}
.el-tabs{
  margin: 10px 0;
}
.el-alert{
  margin-bottom: 20px;
}
</style>
