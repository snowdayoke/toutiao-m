<template>
  <div class="user-profile">
    <!-- 导航栏 -->
    <van-nav-bar
      class="pages-nav-bar"
      title="个人信息"
      left-arrow
      @click-left="$router.back()"
    />

    <input
      type="file"
      hidden
      ref="file"
      @change="onFileChange"
      >

     <!-- 个人信息 -->
     <van-cell title="头像" is-link center
      @click="$refs.file.click()"
      >
        <van-image
            class="avatar"
            round
            fit="cover"
            :src="user.photo"
        />
     </van-cell>

    <van-cell title="昵称"
       is-link
       :value="user.name"
       @click="isUpdateNameShow = true"
    />
    <van-cell title="性别"
       is-link
       :value="user.gender === 0 ? '男': '女'"
       @click="isUpdateGenderShow = true"
    />
    <van-cell title="生日"
       is-link
       :value="user.birthday"
       @click="isUpdateBirthdayShow = true"
    />

    <!-- 编辑昵称 -->
    <van-popup
        v-model="isUpdateNameShow"
        position="bottom"
        :style="{ height: '100%' }"
    >
        <UpdateName
         v-if="isUpdateNameShow "
         @close="isUpdateNameShow = false"
         v-model="user.name"
        />
    </van-popup>

     <!-- 编辑性别 -->
     <van-popup
        v-model="isUpdateGenderShow"
        position="bottom"
    >
        <updateGender
          @close="isUpdateGenderShow = false"
          v-model="user.gender"
         />
    </van-popup>

     <!-- 编辑生日 -->
      <van-popup
        v-model="isUpdateBirthdayShow"
        position="bottom"
    >
      <updateBirthday
        v-model="user.birthday"
        @close="isUpdateBirthdayShow = false"
      />
    </van-popup>

    <!-- 编辑头像 -->
    <van-popup
        v-model="isUpdatePhotoShow"
        position="bottom"
        style="height: 100%;"
    >
      <UpdatePhoto
      v-if="isUpdatePhotoShow"
      :img="img"
      @close="isUpdatePhotoShow = false"
      @update-photo="user.photo = $event"
      />
    </van-popup>

  </div>
</template>

<script>
import { reqUserProfile } from '@/api/user'
import UpdateName from './components/update-name.vue'
import updateGender from './components/update-gender.vue'
import updateBirthday from './components/update-birthday.vue'
import UpdatePhoto from './components/update-photo.vue'

export default {
  name: 'UserProfile',
  data () {
    return {
      user: {}, // 个人信息
      isUpdateNameShow: false, // 修改昵称弹出框
      isUpdateGenderShow: false, // 修改性别弹出框
      isUpdateBirthdayShow: false,
      isUpdatePhotoShow: false,
      img: null
    }
  },
  components: { UpdateName, updateGender, updateBirthday, UpdatePhoto },
  created () {
    this.loadUserProfile()
  },
  methods: {
    // 加载用户个人信息
    async loadUserProfile () {
      try {
        const { data } = await reqUserProfile()
        this.user = data.data
      } catch (error) {
        this.$toast('获取失败，请稍后重试！')
      }
    },
    onFileChange () {
      // 获取文件对象
      const file = this.$refs.file.files[0]
      // 基于文件对象，获取blob数据
      this.img = window.URL.createObjectURL(file)

      // 展示预览图片弹出层
      this.isUpdatePhotoShow = true

      // file-input 如果选了同一个文件不会触发change事件
      // 解决办法就是每次使用完毕，把它的value清空
      this.$refs.file.value = ''
    }
  }
}
</script>

<style scoped lang="less">
    .user-profile {
        .avatar {
            width: 60px;
            height: 60px;
        }
        .van-popup {
            background-color: #f5f7f9;
        }
    }
</style>
