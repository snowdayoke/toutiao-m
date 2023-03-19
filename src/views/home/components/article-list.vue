<template>
  <div class="article-list">
    <!--
        List 列表组件：
        通过loading 和 finished 两个变量控制加载状态。
        当组件初始化或滚动到底部时，会触发load事件，并将 loading 【自动】设置为true，此时可以发起异步操作并更新数据。
        数据更新完毕后，将loading设置成false即可
        若数据已全部加载完毕，则直接将 finished 设置成 true 即可。

        load事件：
        + List初始化后会触发一次load事件，用于加载第一屏的数据。
        + 如果一次请求加载的数据条数较少，导致列表内容无法铺满当前屏幕，list会继续触发load事件，直到内容铺满屏幕或数据全部加载完成。
     -->
    <van-pull-refresh
    v-model="isRefreshLoading"
    @refresh="onRefresh"
    :success-text="refreshSuccessText"
    success-duration="1500">
        <van-list
            v-model="loading"
            :finished="finished"
            finished-text="没有更多了"
            :error.sync="error"
            error-text="请求失败，点击重新加载"
            @load="onLoad"
        >
            <ArticleItem v-for="(article, index) in list" :key="index" :article="article"></ArticleItem>

            <!-- <van-cell
            v-for="(article, index) in list"
            :key="index"
            :title="article.title" /> -->
        </van-list>
    </van-pull-refresh>
  </div>
</template>

<script>
import { reqArticles } from '@/api/article'
import ArticleItem from '@/components/article-item'

export default {
  name: 'ArticleList',
  props: ['channel'],
  components: { ArticleItem },
  data () {
    return {
      list: [], // 存储列表数据的的数组
      loading: false, // 控制加载中 loading 状态
      finished: false, // 控制数据加载结束的状态
      timestamp: null, // 获取下一页的时间戳
      error: false, // 控制列表加载失败的提示状态
      isRefreshLoading: false, // 控制下拉刷新的loading状态
      refreshSuccessText: '刷新成功' // 下拉刷新成功默认提示信息
    }
  },
  methods: {
    // 文章列表加载数据
    async onLoad () {
      try {
        // 1.请求获取数据
        const { data } = await reqArticles({
          channel_id: this.channel.id, // 频道ID
          // timestamp 简单理解就是请求数据的页码
          // 请求第一页数据：当前最新时间戳
          // 请求之后数据的时间戳会在当前请求结果中返回给你
          timestamp: this.timestamp || Date.now()
          // with_top: 1
        })

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //     JSON.parse('asjoufhdufeo')
        // }

        // 2.把请求结果数据放到list 数组中
        const { results } = data.data
        // 数组的展开操作符，将数组里面的元素一个一个拿出来
        this.list.push(...results)

        // 3.本次数据加载状态结束之后，要把加载状态设置为结束
        // loading 关闭以后才能触发下一次的加载更多
        this.loading = false

        // 4. 判断数据是否全部加载完成
        if (results.length) {
          // 更新获取下一页数据的时间戳
          this.timestamp = data.data.pre_timestamp
        } else {
          // 如果没有数据了，把finished 设置为true，之后就不再触发加载更多
          this.finished = true
        }
      } catch (err) {
        // 展示错误提示信息
        this.error = true
        // 请求失败了，loading也需要关闭
        this.loading = false
      }
    },
    // 列表刷新回调
    async onRefresh () {
      try {
      // 1.请求获取数据
        const { data } = await reqArticles({
          channel_id: this.channel.id, // 频道ID
          timestamp: Date.now()
          // with_top: 1
        })
        // if (Math.random() > 0.5) {
        //     JSON.parse('asjoufhdufeo')
        // }
        const { results } = data.data
        // 2.将数据追加到列表的顶部
        this.list.unshift(...results)
        // 3.关闭下拉刷新的loading状态
        this.isRefreshLoading = false
        // 4.更新下拉刷新成功的提示文本
        this.refreshSuccessText = `刷新成功，更新了${results.length}条数据`
      } catch (error) {
        this.isRefreshLoading = false
        this.refreshSuccessText = '刷新失败'
      }
    }
  }
}
</script>

<style lang="less">
    .article-list {
        height: 79vh;
        overflow-y: auto;
    }
</style>
