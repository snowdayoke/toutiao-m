<template>
  <div class="update-gender">
    <van-picker
        title="标题"
        show-toolbar
        :columns="columns"
        :default-index="value"
        @confirm="onConfirm"
        @cancel="$emit('close')"
        @change="onChange"
    />
  </div>
</template>

<script>
import { reqUpdateUserProfile } from '@/api/user'

export default {
  name: 'UpdateGender',
  props: ['value'],
  data () {
    return {
      columns: ['男', '女'],
      localGender: this.value
    }
  },
  methods: {
    onChange (picker, value, index) {
      this.localGender = index
    },
    async onConfirm () {
      this.$toast.loading({
        message: '保存中...',
        forbidClick: true, // 禁止背景点击
        duration: 0 // 持续展示
      })
      try {
        const localGender = this.localGender

        await reqUpdateUserProfile({
          gender: localGender
        })

        // 更新视图
        this.$emit('input', localGender)
        // 关闭弹层
        this.$emit('close')
        // 提示成功
        this.$toast.success('更新成功')
      } catch (error) {
        this.$toast.fail('更新失败')
      }
    }
  }
}
</script>

<style>

</style>
