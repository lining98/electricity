module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://192.168.124.61:8888/api/private/v1',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
}
