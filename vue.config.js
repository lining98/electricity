module.exports = {
  publicPath: './',
  devServer: {
    proxy: {
      '/api': {
        target: 'http://127.0.0.1:8888/api/private/v1/',
        changeOrigin: true,
        pathRewrite: { '^/api': '' },
      },
    },
  },
}
