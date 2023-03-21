<template>
  <div class="search-result">
    <van-list
      v-model="loading"
      :finished="finished"
      finished-text="没有更多了"
      @load="onLoad"
      :error.sync="error"
      error-text="请求失败，点击重新加载"
    >
      <van-cell
      v-for="(article,index) in list"
      :key="index"
      :title="article.title" />
    </van-list>
  </div>
</template>

<script>
import { reqSearchResult } from '@/api/search'
export default {
  name: 'searchResult',
  props: ['searchText'],
  data () {
    return {
      list: [],
      loading: false,
      finished: false,
      error: false,
      page: 1,
      perPage: 20
    }
  },
  methods: {
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await reqSearchResult({
          page: this.page, // 页码
          per_page: this.perPage, // 每页数据
          q: this.searchText // 搜索词
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //     JSON.parse('asjoufhdufeo')
        // }

        // 2.将数据添加到数组列表中
        const { results } = data.data
        this.list.push(...results)
        // 3.将本次加载中的loading关闭
        this.loading = false
        // 4.判断是否还有数据
        // 如果有，则更新获取下一个数据的页码
        // 如果没有，则将加载状态finished设置为结束
        if (results.length) {
          this.perPage++
        } else {
          this.finished = true
        }
      } catch (error) {
        // 展示加载失败的提示状态
        this.error = true
        // 加载失败了,loading也要关闭
        this.loading = false
      }
    }
  }
}
</script>

<style>

</style>
