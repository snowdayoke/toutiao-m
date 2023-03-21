<template>
  <van-cell class="commentInfo-item">
    <van-image
      slot="icon"
      class="avatar"
      round
      fit="cover"
      :src="commentInfo.aut_photo"
    />
    <div class="title-wrap" slot="title">
        <div class="user-name">{{ commentInfo.aut_name }}</div>
        <van-button
          class="like-btn"
          :icon="commentInfo.is_liking ? 'good-job' : 'good-job-o'"
          :class="{liked: commentInfo.is_liking}"
          @click="onCommentLike"
          :loading="commentInfoLoading"
        >{{ commentInfo.like_count || '赞' }}</van-button>
    </div>

    <div slot="label">
        <p class="commentInfo-content">{{ commentInfo.content }}</p>
        <div class="bottom-info">
            <span class="commentInfo-pubdate">{{ commentInfo.pubdate | relativeTime }}</span>
            <van-button
            class="reply-btn"
            round
            >回复 {{ commentInfo.reply_count }}</van-button>
        </div>
    </div>
  </van-cell>
</template>

<script>
import { reqAddCommentLike, reqDeleteCommentLike } from '@/api/comment'
export default {
  name: 'CommentItem',
  props: ['comment'],
  computed: {
    commentInfo () {
      return this.comment
    }
  },
  data () {
    return {
      commentInfoLoading: false
    }
  },
  methods: {
    async onCommentLike () {
      this.commentInfoLoading = true
      try {
        if (this.commentInfo.is_liking) {
          // 已点赞，取消点赞
          await reqDeleteCommentLike(this.commentInfo.com_id)
          this.commentInfo.like_count--
          // 未点赞，添加点赞
        } else {
          await reqAddCommentLike(this.commentInfo.com_id)
          this.commentInfo.like_count++
        }
        this.commentInfo.is_liking = !this.commentInfo.is_liking
      } catch (error) {
        this.$toast('操作失败，请重试！')
      }
      this.commentInfoLoading = false
    }
  }
}
</script>

<style scoped lang="less">
    .commentInfo-item {
        .avatar {
            width: 72px;
            height: 72px;
            margin-right: 25px;
        }
        .title-wrap {
            display: flex;
            justify-content: space-between;
            align-items: center;
            .user-name {
                color: #406599;
                font-size: 26px;
            }
        }
        .commentInfo-content {
            font-size: 19px;
            color: #222;
            margin-right: 25px;
        }
        .bottom-info {
            display: flex;
            align-items: center;
        }
        .reply-btn {
            width: 135px;
            height: 48px;
            line-height: 48px;
            font-size: 21px;
            color: #222;
        }
        .like-btn {
            height: 30px;
            padding: 0;
            border: none;
            font-size: 19px;
            line-height: 30px;
            margin-right: 7px;
            .van-icon {
                font-size: 30px;
            }
            &.liked {
                color: #e5645f;
            }
        }
    }
</style>
