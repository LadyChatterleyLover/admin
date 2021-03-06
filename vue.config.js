module.exports = {
  devServer: {
    host: '0.0.0.0',
    port: 9527,
    proxy: {
      '/api': {
        ws: false,
        target: 'http://localhost:3000',
        changeOrigin: true,
        pathRewrite: {
          '^/api': ''
        }
      },
    }
  }
}
