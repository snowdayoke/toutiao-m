<template>
  <div class="home-container">
    <!-- 导航栏 -->
    <van-nav-bar class="pages-nav-bar" fixed>
      <van-button slot="title" round type="info" icon="search" size="small"
      class="search-btn"
      >搜索</van-button>
    </van-nav-bar>
    <!-- 频道列表 -->
    <van-tabs class="channel-tabs" v-model="active" animated swipeable>
      <van-tab :title="channel.name"
      v-for="channel in channels"
      :key="channel.id"
    >
    <!-- 频道列表组件 -->
    <ArticleList :channel="channel" />
    </van-tab>
      <div slot="nav-right" class="placeholder"></div>
      <div slot="nav-right" class="hamburger-btn" @click="isChannelEditShow = true">
        <i class="iconfont icon-hanbaobao"></i>
      </div>
    </van-tabs>
    <!-- 频道编辑弹出层 -->
    <van-popup
      v-model="isChannelEditShow"
      closeable
      position="bottom"
      close-icon-position="top-left"
      :style="{ height: '100%' }"
    >
      <!-- 频道编辑组件 -->
      <ChannelEdit
      :my-channels="channels"
      :active="active"
      @update-active="onUpdateActive"
      />
    </van-popup>
  </div>
</template>

<script>
import { reqUserChannels } from '@/api/user'
import ArticleList from './components/article-list.vue'
import ChannelEdit from './components/channel-edit.vue'
export default {
  name: 'HomeIndex',
  components: { ArticleList, ChannelEdit },
  data () {
    return {
      active: 0,
      channels: [], // 频道列表
      isChannelEditShow: false
    }
  },
  created () {
    this.loadChannels()
  },
  methods: {
    // 获取用户频道列表
    async loadChannels () {
      try {
        const { data } = await reqUserChannels()
        this.channels = data.data.channels
      } catch (error) {
        this.$toast('加载失败，请稍后重试')
      }
    },
    // 频道编辑传递index的自定义事件回调
    onUpdateActive (index) {
      this.active = index
      this.isChannelEditShow = false
    }
  }
}
</script>

<style lang="less" scoped>
  .home-container {
    padding-bottom: 100px;
    padding-top: 174px;
    .van-nav-bar__title {
      max-width: unset;
    }
    .search-btn {
      width: 555px;
      height: 64px;
      background-color: #5babfb;
      border: none;
      font-size: 28px;
      .van-icon {
        font-size: 32px;
      }
    }
    /deep/ .channel-tabs {
      .van-tabs__wrap {
        height: 82px;
        position: fixed;
        top: 92px;
        z-index: 2;
        left: 0;
        right: 0;
      }
      .van-tab {
        min-width: 200px;
        border-right: 1px solid #edeff3;
        font-size: 30px;
        color: #777;
      }
      .van-tab--active {
        color: #333;
      }
      .van-tabs__nav {
        padding-bottom: 0;
      }
      .van-tabs__line {
        bottom: 8px;
        width: 31px;
        height: 6px;
        background-color: #3296fa;
      }
      .placeholder {
        flex-shrink: 0;
        width: 66px;
        height: 82px;
      }
      .hamburger-btn {
        position: fixed;
        right: 0;
        width: 66px;
        height: 82px;
        display: flex;
        justify-content: center;
        align-items: center;
        background-color: #fff;
        opacity: 0.902;
        i.iconfont {
          font-size: 33px;
        }
        &:before {
          content: "";
          position: absolute;
          left: 0;
          width: 1px;
          height: 100%;
          background-color: purple;
        }
      }
    }
  }
</style>
