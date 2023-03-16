// PostCss配置文件

module.exports = {
  // 配置要使用的PostCss插件
  plugins: {
    // 配置使用autoprefixer插件
    // 作用：生成浏览器 CSS 样式规则前缀
    // vue-cli 已经配置了，这里再配置一遍会冲突，因此注释掉
    //  'autoprefixer': {
    //    browsers: ['Android >= 4.0', 'ios >= 8']   // 配置要兼容到的环境信息
    //  },
    // 配置使用的 postcss-pxtorem 插件：把px转为rem
    'postcss-pxtorem': {
      rootValue ({ file }) {
        return file.indexOf('vant') !== -1 ? 37.5 : 75
      }, // 根元素的值
      propList: ['*']
    }
  }
}
