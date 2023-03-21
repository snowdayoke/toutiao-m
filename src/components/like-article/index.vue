<template>
   <van-button
        :icon="value === 1 ? 'good-job' : 'good-job-o'"
        :class="{liked: value === 1}"
        :loading="loading"
        @click="onLike"
    />
</template>

<script>
import { reqAddLike, reqDeleteLike } from '@/api/article'
export default {
  name: 'LikeArticle',
  props: ['value', 'artId'],
  data () {
    return {
      loading: false
    }
  },
  methods: {
    async onLike () {
      this.loading = true
      try {
        let status = -1
        if (this.value === 1) {
          // 已点赞，取消点赞
          await reqDeleteLike(this.artId)
        } else {
          // 未点赞，添加点赞
          await reqAddLike(this.artId)
          status = 1
        }

        // 更新视图
        this.$emit('input', status)
        this.$toast.success(status === 1 ? '点赞成功' : '取消点赞')
      } catch (error) {
        this.$toast('操作失败，请重试！')
      }
      this.loading = false
    }
  }
}
</script>

<style lang="less" scoped>
    .liked {
        .van-icon {
            color: #e5645f;
        }
    }
</style>
