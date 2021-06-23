module.exports = {
  transpileDependencies: ['luch-request'],
  devServer: {
    port: 9696,
    open: true,
    proxy: {
      // detail: https://cli.vuejs.org/config/#devserver-proxy
      [process.env.VUE_APP_BASE_API]: {
        target: 'http://localhost',
        changeOrigin: true, // needed for virtual hosted sites
        ws: false, // proxy websockets
        pathRewrite: {
          ['^' + process.env.VUE_APP_BASE_API]: ''
        }
      }
    },
  }
}
