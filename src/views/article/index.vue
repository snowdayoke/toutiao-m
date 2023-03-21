<template>
  <div class="article-container">
    <!-- 导航栏 -->
    <van-nav-bar
    class="pages-nav-bar"
    left-arrow
    title="黑马头条"
    @click-left="$router.back()"
    >
    </van-nav-bar>

    <div class="main-wrap">
      <!-- 加载中 -->
      <div class="loading-wrap" v-if="loading">
        <van-loading
        color="#3296fa"
        vertical
        >加载中
        </van-loading>
      </div>

      <!-- 加载完成-文章详情 -->
      <div class="article-detail" v-else-if="article.title">
        <!-- 文章标题 -->
        <h1 class="article-title">{{ article.title }}</h1>

        <!-- 用户信息 -->
        <van-cell class="user-info" center :border="false">
          <van-image
          class="avatar"
          slot="icon"
          round
          fit="cover"
          :src="article.aut_photo"
          />
          <div slot="title" class="user-name">{{ article.aut_name }}</div>
          <div slot="label" class="publish-date">{{ article.pubdate | relativeTime }}</div>
          <!--
            关注 和 取消关注组件
            模板中的 $event 是事件参数
            1.当我们传递给子组件的数据既要使用还要修改。
            传递：props     :isFollowed="article.is_followed"
            修改：自定义事件   @updateIsFollowed="article.is_followed = $event"
            简写方式：在组件上使用v-model
              value="article.is_followed"
              @input="article.is_followed = $event"
            2.如果需要修改v-model的规则名称，可以通过子组件的model属性修改
            3.一个组件上只能使用一次v-model
            如果有多个数据需要实现类似于v-model的效果？咋办
            可以使用属性的 .sync 修改符
           -->
          <followUser
          class="follow-btn"
          v-model="article.is_followed"
          :atuId="article.aut_id"
          />
          <!-- <van-button
          v-if="article.is_followed"
            class="follow-btn"
            round
            @click="onFollow"
            :loading="followLoading"
          >已关注</van-button>
          <van-button
            v-else
            class="follow-btn"
            round
            type="info"
            icon="plus"
            @click="onFollow"
            :loading="followLoading"
          >关注</van-button> -->
        </van-cell>

        <!-- 文章内容 -->
        <div class="article-content markdown-body"
        v-html="article.content"
        ref="article-content"
        ></div>
        <van-divider>正文结束</van-divider>

        <!-- 文章评论列表 -->
        <CommentList
          :source="article.art_id"
          @onload-success="onLoadCommentSuccess"
          :list="commentList"
         />

         <!-- 底部区域 -->
        <div class="article-bottom">
            <van-button
              round
              class="comment-btn"
              type="default"
              @click="isPostShow = true"
            >写评论</van-button>
            <van-icon
              class="comment-icon"
              name="comment-o"
              :badge="totalCommentCount"
            />
            <!-- 收藏组件 -->
            <CollectArticle
              class="btn-item"
              v-model="article.is_collected"
              :artId="article.art_id"
            />
            <!-- 点赞 组件 -->
            <LikeArticle
            class="btn-item"
            v-model="article.attitude"
            :artId="article.art_id"
            />
            <van-icon name="share" color="#777777"></van-icon>
        </div>

        <!-- 发布评论 -->
        <van-popup
          v-model="isPostShow"
          position="bottom"
        >
          <CommentPost
            :target="article.art_id"
            @post-success="onPostSuccess"
          />
        </van-popup>
      </div>

      <!-- 加载失败：404 -->
      <div class="error-wrap" v-else-if="errStatus === 404">
        <van-icon name="failure"></van-icon>
        <p class="text">该资源不存在或已删除</p>
      </div>

      <!-- 加载失败:其他未知错误 (例如网络原因或服务器异常)-->
      <div class="error-wrap" v-else>
        <van-icon name="failure"></van-icon>
        <p class="text">内容加载失败！</p>
        <van-button class="retry-btn" @click="loadArticle">点击重试</van-button>
      </div>
    </div>
  </div>
</template>

<script>
import { reqArticleById } from '@/api/article'
import { ImagePreview } from 'vant'
import followUser from '@/components/follow-user'
import CollectArticle from '@/components/collect-article'
import LikeArticle from '@/components/like-article'
import CommentList from './components/comment-list.vue'
import CommentPost from './components/comment-post.vue'

export default {
  name: 'articleIndex',
  data () {
    return {
      article: {}, // 文章详情
      loading: true, // 加载中的loading状态
      errStatus: 0, // 失败的状态码
      totalCommentCount: 0, // 评论总数量
      isPostShow: false, // 控制发布评论的显示状态
      commentList: []
    }
  },
  components: { followUser, CollectArticle, LikeArticle, CommentList, CommentPost },
  props: {
    articleId: {
      type: [Number, String],
      required: true
    }
  },
  created () {
    this.loadArticle()
  },
  methods: {
    // 加载文章数据
    async loadArticle () {
      this.loading = true
      try {
        const { data } = await reqArticleById(this.articleId)

        // 模拟随机失败的情况
        // if (Math.random() > 0.5) {
        //   JSON.parse('asjoufhdufeo')
        // }

        // 初始化图片点击预览
        // 主句驱动这件事儿不是立即的，这里需要设置延迟定时器，异步处理获取
        setTimeout(() => {
          this.previewImage()
        }, 0)

        this.article = data.data

        // 请求成功，关闭loading
        // this.loading = false
      } catch (err) {
        if (err.response && err.response.status === 404) {
          this.errStatus = 404
        }
      }
      // 无论成功还是失败，都关闭loading
      this.loading = false
    },
    // 预览图片回调
    previewImage () {
      // 1.得到所有的img节点
      const articleContent = this.$refs['article-content']
      const imgs = articleContent.querySelectorAll('img')
      // 2.获取所有img地址
      const images = []
      imgs.forEach((img, index) => {
        images.push(img.src)
        // 3.给每个img注册点击事件，在处理函数中调用预览
        img.onclick = () => {
          // 4.预览图片函数
          ImagePreview({
            // 预览的图片地址数组
            images: images,
            // 起始位置，从0开始
            startPosition: index
          })
        }
      })
    },
    // 评论加载成功
    onLoadCommentSuccess (data) {
      this.totalCommentCount = data.total_count
    },
    // 发布成功
    onPostSuccess (data) {
      // 关闭弹出层
      this.isPostShow = false
      // 将发布内容显示到列表顶部
      this.commentList.unshift(data.new_obj)
    }
  }
}
</script>

<style lang="less" scoped>
@import './github-markdown.css';
  .article-container {
    .main-wrap {
      position: fixed;
      left: 0;
      right: 0;
      top: 92px;
      bottom: 88px;
      overflow-y: scroll;
      background-color: #fff;
    }

    .article-detail {
      .article-title {
        font-size: 40px;
        padding: 50px 32px;
        margin: 0;
        color: #3a3a3a;
      }
      .user-info {
        padding: 0 32px;
        .avatar {
          width: 70px;
          height: 70px;
          margin-right: 17px;
        }
        .van-cell__label {
          margin-top: 0;
        }
        .follow-btn {
          width: 170px;
          height: 50px;
        }
      }

      .article-content {
        padding: 50px 32px;
        /deep/ p {
          text-align: justify;
        }
      }
    }

    .loading-wrap {
      padding: 200px 32px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: #fff;
    }

    .error-wrap {
      padding: 200px 32px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      background-color: #fff;
      .van-icon {
        font-size: 122px;
        color: #b4b4b4;
      }
      .text {
        font-size: 30px;
        color: #666;
        margin: 33px 0 46px;
      }
      .retry-btn {
        width: 280px;
        height: 70px;
        line-height: 70px;
        border: 1px solid #c3c3c3;
        font-size: 30px;
        color: #666;
      }
    }
    .article-bottom {
      position: fixed;
      left: 0;
      right: 0;
      bottom: 0;
      display: flex;
      justify-content: space-between;
      align-items: center;
      box-sizing: border-box;
      height: 88px;
      border: 1px solid #d8d8d8;
      background-color: #fff;
      .comment-btn {
        width: 282px;
        height: 46px;
        margin-left: 25px;
        border: 2px solid #eee;
        font-size: 30px;
        line-height: 46px;
        color: #a7a7a7;
      }
      /deep/ .van-icon {
        font-size: 40px;
      }
      .comment-icon {
        top: 2px;
        color: #777;
        .van-info {
          font-size: 16px;
          background-color: #e22829;
        }
      }
      .btn-item {
        border: none;
        padding: 0;
        height: 40px;
        line-height: 40px;
        color: #777;
      }
      .collect-btn--collected {
        color: #ffa500;
      }
      .like-btn--liked {
        color: #e5645f;
      }
      .van-icon-share {
        margin-right: 25px;
      }
    }
  }
</style>
