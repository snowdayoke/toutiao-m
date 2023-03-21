<template>
    <van-button
        :icon="value ? 'star' : 'star-o'"
        :class="{liked: value}"
        :loading="loading"
        @click="onCollect"
    />
</template>

<script>
import { reqAddCollect, reqDeleteCollect } from '@/api/article'
export default {
  name: 'CollectArticle',
  props: ['value', 'artId'],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onCollect () {
      this.loading = true
      try {
        if (this.value) {
          // 已收藏，取消收藏
          await reqDeleteCollect(this.artId)
        } else {
          // 未收藏，添加收藏
          await reqAddCollect(this.artId)
        }
        // 更新视图
        // 自定义事件修改数据不是立即的
        this.$emit('input', !this.value)

        this.$toast.success(!this.value ? '收藏成功' : '取消收藏')
      } catch (error) {
        this.$toast('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less">
    .collected {
        .van-icon {
            color: #ffa500;
        }
    }
</style>
