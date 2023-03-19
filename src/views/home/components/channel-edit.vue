<template>
  <div class="channel-edit">
    <!-- 我的频道 -->
    <van-cell :border="false">
        <div slot="title" class="title-text">我的频道</div>
        <!-- 这里用了默认插槽slot="default"。 plain朴素按钮 -->
        <van-button type="danger" plain size="mini" round class="edit-btn"
        @click="isEdit = !isEdit"
        >{{ isEdit === true ? '完成' : '编辑' }}</van-button>
    </van-cell>
    <van-grid :gutter="10" class="my-grid">
        <van-grid-item
            class="grid-item"
            v-for="(channel,index) in myChannelList"
            :key="index"
            @click="onMyChannelsClick(channel,index)"
            >
            <!--
                :class="{}"语法
                对象中的key 表示要作用的css类名
                对象中的value 表示要计算出布尔值
                true，则使用该类名
                false，则不作用该类名
             -->
             <van-icon slot="icon" name="clear"
             v-show="isEdit && !fixChannels.includes(channel.id)"
             ></van-icon>
            <div slot="text"
              class="text"
              :class="{active: index === active}"
            >{{ channel.name }}</div>
        </van-grid-item>
    </van-grid>
     <!-- 频道推荐 -->
     <van-cell :border="false">
        <div slot="title" class="title-text">频道推荐</div>
    </van-cell>
    <van-grid :gutter="10" class="recommend-grid">
        <van-grid-item
        class="grid-item"
        v-for="(channel,index) in recommendChannels"
        :key="index"
        icon="plus"
        @click="onAddChannel(channel)"
        :text="channel.name" />
    </van-grid>
  </div>
</template>

<script>
import { reqAllChannels } from '@/api/channel'

export default {
  name: 'ChannelEdit',
  data () {
    return {
      allChannels: [], // 所有频道列表
      isEdit: false, // 频道按钮是否可编辑状态
      fixChannels: [0] // 固定频道，不允许被删除
    }
  },
  props: ['myChannels', 'active'],
  created () {
    this.loadAllChannels()
  },
  computed: {
    myChannelList () {
      return this.myChannels
    },
    // 计算属性会观测内部依赖数据的变化
    // 如果依赖的数据发生变化，则计算属性会重新执行
    recommendChannels () {
      return this.allChannels.filter(channel => {
        return !this.myChannelList.find(mychannel => {
          return mychannel.id === channel.id
        })
      })
    }
  },
  methods: {
    // 加载所有频道列表
    async loadAllChannels () {
      try {
        const { data } = await reqAllChannels()
        this.allChannels = data.data.channels
      } catch (err) {
        this.$toast('请求失败')
      }
    },
    // 点击添加到 我的频道
    onAddChannel (channel) {
      this.myChannelList.push(channel)
    },
    // 我的频道项 点击事件
    onMyChannelsClick (channel, index) {
      if (this.isEdit) {
        // 编辑状态，执行删除频道
        this.myChannelList.splice(index, 1)
      } else {
        // 非编辑状态，执行切换频道
        this.$emit('update-active', index)
      }
    }
  }
}
</script>

<style lang="less">
    .channel-edit {
        padding: 85px 0;
        .title-text {
            font-size: 32px;
            color: #333;
        }
        .edit-btn {
            width: 104px;
            height: 48px;
            font-size: 26px;
            color: #f85959;
            border: 1px solid #f85959;
        }
        .grid-item {
            width: 160px;
            height: 80px;
            .van-grid-item__content {
                white-space: nowrap;
                background-color: #f4f5f6;
                .van-grid-item__text, .text {
                    font-size: 28px;
                    color: #222;
                    margin-top: 0;
                }
                .active {
                    color: #f85959;
                }
            }
        }
        .my-grid {
            .van-icon-clear {
                position: absolute;
                right: -10px;
                top: -10px;
                z-index: 2;
                font-size: 30px;
                color: #cacaca;
            }
            .van-grid-item__icon-wrapper {
                position: unset;
            }
        }
        .recommend-grid {
            .van-grid-item__content {
                flex-direction: row;
                .van-icon-plus {
                    font-size: 28px;
                    margin-right: 6px;
                }
            }
        }
    }
</style>
