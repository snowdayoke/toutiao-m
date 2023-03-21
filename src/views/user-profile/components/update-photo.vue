<template>
   <div class="update-photo">
     <img :src="img" class="img" ref="img">

     <div class="toolbar">
        <div class="cancel" @click="$emit('close')">取消</div>
        <div class="confirm" @click="onConfirm">完成</div>
     </div>
   </div>
</template>

<script>
import 'cropperjs/dist/cropper.css'
import Cropper from 'cropperjs'
import { reqUpdateUserPhoto } from '@/api/user'

export default {
  name: 'UpdatePhoto',
  props: ['img'],
  data () {
    return {
      cropper: null
    }
  },
  mounted () {
    const image = this.$refs.img
    this.cropper = new Cropper(image, {
      viewMode: 1,
      dragMode: 'move',
      aspectRatio: 1,
      autoCropArea: 1,
      cropBoxMovable: false,
      cropBoxResizable: false, // 截图区缩放
      background: false,
      movable: true // 背景画布可移动
    })
  },
  methods: {
    onConfirm () {
      // getCroppedCanvas()方法，得到裁切之后的图片对象
      this.cropper.getCroppedCanvas().toBlob((blob) => {
        this.updateUserPhoto(blob)
      })
    },
    async updateUserPhoto (blob) {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        // 如果接口要求Content-Type是application/json，则传递普通 JavaScript 对象
        // 如果接口要求Content-Type是multipart/form-data，则你必须传递FormData对象

        const formData = new FormData()
        formData.append('photo', blob)

        const { data } = await reqUpdateUserPhoto(formData)
        // 关闭弹出层
        this.$emit('close')
        // 更新视图
        this.$emit('update-photo', data.data.photo)

        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style lang="less">
   .update-photo {
    background-color: #000;
    height: 100%;
    .toolbar {
        position: fixed;
        left: 0;
        right: 0;
        bottom: 0;
        display: flex;
        justify-content: space-between;
        .cancel, .confirm {
            width: 90px;
            height: 90px;
            font-size: 30px;
            display: flex;
            justify-content: center;
            align-items: center;
            color: #fff;
        }
    }
   }
    .img {
        display: block;
        max-width: 100%;
    }
</style>
