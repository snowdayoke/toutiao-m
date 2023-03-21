<template>
  <div class="search-container">
    <!-- 顶部搜索栏 -->
    <!-- Tips: 在 van-search 外层增加 form 标签，且 action 不为空，即可在 iOS 输入法中显示搜索按钮。 -->
    <form action="/" class="search-form">
        <van-search
            v-model="searchText"
            show-action
            placeholder="请输入搜索关键词"
            @search="onSearch"
            @cancel="onCancel"
            @focus="isResultShow = false"
            background="#3296fa"
        />
    </form>
    <!-- 搜索结果 -->
    <searchResult v-if="isResultShow"
    :searchText="searchText"/>

    <!-- 联想建议 -->
    <searchSuggestion
    v-else-if="searchText"
    :searchText="searchText"
    @search="onSearch"
     />

    <!-- 搜索历史记录 -->
    <searchHistory v-else />
  </div>
</template>

<script>
import searchHistory from './components/search-history'
import searchSuggestion from '@/views/search/components/search-suggestion'
import searchResult from '@/views/search/components/search-result'
export default {
  name: 'searchIndex',
  data () {
    return {
      searchText: '',
      isResultShow: false
    }
  },
  components: { searchHistory, searchSuggestion, searchResult },
  methods: {
    onSearch (val) {
      console.log(val)
      this.searchText = val
      this.isResultShow = true
    },
    onCancel () {
      this.$router.back()
    }
  }
}
</script>

<style lang="less">
    .search-container {
        padding-top: 108px;
        .van-search__action {
            color: #fff;
        }
        .search-form {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            z-index: 1;
        }
    }
</style>
