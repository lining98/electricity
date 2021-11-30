<template>
  <router-view></router-view>
</template>

<script>
export default {
  props: {},
  data() {
    return {};
  },
  methods: {},
  components: {},
};
</script>

<style lang="scss">
* {
  margin: 0;
  padding: 0;
}
html,
body {
  height: 100%;
}
ul,
ol {
  list-style: none;
}
a {
  text-decoration: none;
}
input {
  outline: none;
}
.el-icon-success{
  color:#67C23A;
}
.el-icon-error{
  color:#F56C6C;
}
.el-icon-warning{
  color:#E6A23C;
}
.el-breadcrumb{
  line-height: 50px;
  padding-bottom: 15px;
}
</style>
