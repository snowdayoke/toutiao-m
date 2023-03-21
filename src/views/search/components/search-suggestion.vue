<template>
  <div class="search-suggestion">
    <van-cell icon="search"
    v-for="(text,index) in suggestions"
    :key="index"
    @click="$emit('search', text)"
    >
      <div slot="title" v-html="highlight(text)"></div>
    </van-cell>

    <!-- 双花括号绑定会直接输出纯文本内容 -->
    <!-- <div>{{ htmlStr }}</div> -->
    <!-- 使用v-html 指令可以绑定渲染带有html标签的字符串 -->
    <!-- <div v-html="htmlStr"></div> -->
  </div>
</template>

<script>
import { reqSearchSuggestion } from '@/api/search'
// 按需加载，只会把使用到的成员打包到结果中
import { debounce } from 'lodash'

export default {
  name: 'searchSuggestion',
  props: ['searchText'],
  data () {
    return {
      suggestions: [] // 联想建议数据列表
    }
  },
  watch: {
    searchText: {
      immediate: true, // 该回调将会在侦听开始之后被立即调用
      // 当 searchText 发生改变时，就会调用handler函数

      // debounce防抖函数：参数1：函数； 参数2：延迟时间
      // 返回值：防抖之后的函数
      handler: debounce(function (val) {
        this.loadSearchSuggestion(val)
      }, 500)

      // handler (val) {
      //   this.loadSearchSuggestion(val)
      // }
    }
  },
  methods: {
    // 加载联想建议数据
    async loadSearchSuggestion (q) {
      try {
        const { data } = await reqSearchSuggestion(q)
        this.suggestions = data.data.options
      } catch (error) {
        this.$toast('获取失败，请稍后重试')
      }
    },
    // 搜索高亮文本回调
    highlight (text) {
      const highlightStr = `<span class="active">${this.searchText}</span>`
      // 正则表达式 //中间的内容都会当做匹配字符来使用，而不是数据变量
      // 如果需要根据数据变量动态的创建正则表达式，则手动 new RegExp
      // RegExp正则表达式构造函数
      // 参数1：匹配模式字符串，它会根据这个字符串创建正则对象
      // 参数2：匹配模式，要写到字符串中
      const reg = new RegExp(this.searchText, 'gi')
      return text.replace(reg, highlightStr)
    }
  }
}
</script>

<style lang="less" scoped>
  .search-suggestion {
    /deep/ span.active {
      color: #3296fa;
    }
  }
</style>
