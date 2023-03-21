<template>
    <div class="my-container">
      <!-- 已登录头部 -->
      <div v-if="user" class="header user-info">
        <!-- 基本信息 -->
        <div class="base-info">
          <div class="left">
            <van-image class="avatar" round fit="cover"
            :src="userInfo.photo"
          />
          <span class="name">{{ userInfo.name }}</span>
          </div>
          <div class="right">
            <van-button
             round
            size="mini"
            to="/user/profile"
            >编辑资料</van-button>
          </div>
        </div>
        <!-- 相关数据 -->
        <div class="data-stats">
          <div class="data-item">
            <span class="count">{{ userInfo.art_count }}</span>
            <span class="text">头条</span>
          </div>
          <div class="data-item">
            <span class="count">{{ userInfo.follow_count }}</span>
            <span class="text">关注</span>
          </div>
          <div class="data-item">
            <span class="count">{{ userInfo.fans_count }}</span>
            <span class="text">粉丝</span>
          </div>
          <div class="data-item">
            <span class="count">{{ userInfo.like_count }}</span>
            <span class="text">获赞</span>
          </div>
        </div>
      </div>
      <!-- 未登录头部 -->
      <div v-else class="header not-login">
        <div class="login-btn" @click="$router.push('/login')">
          <img class="mobile-img" src="~@/assets/shouji.jpg">
          <span class="text">登录 / 注册</span>
        </div>
      </div>
      <!-- 宫格导航 -->
      <!-- clickable 开启格子点击反馈 -->
      <van-grid class="grid-nav" :column-num="2" clickable>
        <van-grid-item class="grid-item">
          <i slot="icon" class="iconfont icon-shoucang"></i>
          <span slot="text" class="text">收藏</span>
        </van-grid-item>
        <van-grid-item class="grid-item">
          <i slot="icon" class="iconfont icon-lishi"></i>
          <span slot="text" class="text">历史</span>
        </van-grid-item>
      </van-grid>
      <!-- 单元格 -->
      <van-cell title="消息通知" is-link />
      <van-cell class="md-9" title="小智同学" is-link />
      <van-cell class="logout-cell" title="退出登录" v-if="user" clickable @click="onLogout"/>
    </div>
</template>

<script>
import { mapState } from 'vuex'
import { reqUserInfo } from '@/api/user'
export default {
  name: 'MyIndex',
  data () {
    return {
      userInfo: {}
    }
  },
  created () {
    // 用户登录了，才获取加载信息展示
    if (this.user) {
      this.loaderUserInfo()
    }
  },
  computed: {
    ...mapState(['user'])
  },
  methods: {
    async loaderUserInfo () {
      try {
        const { data } = await reqUserInfo()
        this.userInfo = data.data
      } catch (err) {
        this.$toast('获取数据失败，请稍后重试')
      }
    },
    onLogout () {
      // 1.退出提示
      this.$dialog.confirm({
        message: '确认退出吗'
      })
        .then(() => {
          // 2.确认退出后：清除登录状态（容器中的user + 本地存储中的user）
          this.$store.commit('SETUSER', null)
        })
        .catch(() => {
          console.log('取消执行这里')
        })
    }
  }
}
</script>

<style lang="less">
  .my-container {
    .header {
      height: 361px;
      background: url(~@/assets/banner.png);
      background-size: cover;
    }

    .not-login {
      display: flex;
      justify-content: center;
      align-items: center;
      .login-btn {
        display: flex;
        justify-content: center;
        align-content: center;
        flex-direction: column;
        .mobile-img {
          width: 132px;
          height: 132px;
          margin-bottom: 15px;
        }
        .text {
          font-size: 28px;
          color: #fff;
        }
      }
    }

    .user-info {
      .base-info {
        height: 231px;
        display: flex;
        justify-content: space-between;
        align-items: center;
        padding: 76px 32px 23px;
        box-sizing: border-box;
        .left {
          display: flex;
          align-items: center;
          .avatar {
            width: 132px;
            height: 132px;
            margin-right: 23px;
            border: 4px solid #fff;
          }
          .name {
            font-size: 30px;
            color: #fff;
          }
        }
      }
      .data-stats {
        display: flex;
        .data-item {
          flex: 1;
          height: 130px;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          color: #fff;
          .conut {
            font-size: 36px;
          }
          .text {
            font-size: 23px;
          }
        }
      }
    }

    .grid-nav {
      margin-bottom: 10px;
      .grid-item {
        height: 145px;
        i.iconfont {
          font-size: 45px;
        }
        .icon-shoucang {
          color: #eb5253;
        }
        .icon-lishi {
          color: #ff9d1d;
        }
        span.text {
          font-size: 28px;
        }
      }
    }

    .logout-cell {
      text-align: center;
      color: #eb5253;
      margin-top: 10px;
    }
  }
</style>
