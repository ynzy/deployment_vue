module.exports = {
  publicPath: process.env.NODE_ENV === 'production' ? './' : './',
  outputDir: 'dist', // build输出目录
  indexPath: 'index.html',
  filenameHashing: true,
  lintOnSave: process.env.NODE_ENV === 'production',
  runtimeCompiler: false,
  productionSourceMap: true
}
