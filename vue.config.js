module.exports = {
  chainWebpack: config => {
    config.module.rules.delete('eslint');
  },
  publicPath: '/maxi-booking-test/'
}