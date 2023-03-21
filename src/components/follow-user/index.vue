<template>
    <van-button
        v-if="value"
        class="follow-btn"
        round
        @click="onFollow"
        :loading="loading"
    >已关注</van-button>
        <van-button
        v-else
        class="follow-btn"
        round
        type="info"
        icon="plus"
        @click="onFollow"
        :loading="loading"
    >关注</van-button>
</template>

<script>
import { reqAddFollow, reqDeleteFollow } from '@/api/user'

export default {
  name: 'followUser',
  props: ['value', 'atuId'],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    // 点击关注 或 取消关注按钮
    async onFollow () {
      this.loading = true // 展示关注按钮的 loading状态
      try {
        if (this.value) {
          // 已关注，取消关注
          await reqDeleteFollow(this.atuId)
        } else {
          // 未关注，添加关注
          await reqAddFollow(this.atuId)
        }

        // 更新视图状态
        // this.article.is_followed = !this.article.is_followed
        // this.$emit('updateIsFollowed', !this.value)
        this.$emit('input', !this.value)
      } catch (err) {
        let message = '操作失败，请重试！'
        if (err.response && err.response.status === 400) {
          message = '你不能关注你自己'
        }
        this.$toast(message)
      }

      this.loading = false // 关闭关注按钮的 loading状态
    }
  }
}
</script>

<style>

</style>
