<template>
  <div class="login-container">
    <!-- 导航栏 -->
    <van-nav-bar class="pages-nav-bar" title="登录"/>
    <!-- 登录的表单 -->
    <!--
      1.给van-field组件配置rules验证规则
      2.当表单提交的时候会自动触发表单验证
        如果验证通过，会触发submit事件
        如果验证失败，不会触发submit
    -->
    <van-form @submit="onSubmit" ref="userForm">
      <van-field
        v-model="user.mobile"
        name="mobile"
        placeholder="请输入手机号"
        :rules="userFormRules.mobile"
        type="number"
        maxlength="11"
      >
        <i slot="left-icon" class="iconfont icon-shouji"></i>
      </van-field>
      <van-field
        v-model="user.code"
        name="code"
        placeholder="请输入验证码"
        :rules="userFormRules.code"
        type="number"
        maxlength="6"
      >
        <i slot="left-icon" class="iconfont icon-mimasuo"></i>
        <template #button>
          <van-count-down v-if="isCountDownShow" :time="10 * 1000" format="ss s" @finish="isCountDownShow = false"/>
          <van-button round size="small" v-else
          type="default"
          class="send-sms-btn"
          @click="onSendSms"
          native-type="button"
        >发送验证码</van-button>
        </template>
      </van-field>
      <div class="login-btn-wrap">
        <van-button block type="info" native-type="submit" class="login-btn">登录</van-button>
      </div>
    </van-form>
  </div>
</template>

<script>
import { reqLogin, reqSendSms } from '@/api/user'
export default {
  name: 'LoginIndex',
  data () {
    return {
      user: {
        mobile: '',
        code: ''
      },
      userFormRules: {
        mobile: [{
          required: true,
          message: '手机号不能为空'
        }, {
          pattern: /^1[3|5|7|8]\d{9}$/,
          message: '手机号格式错误'
        }],
        code: [{
          required: true,
          message: '验证码不能为空'
        }, {
          pattern: /^\d{6}$/,
          message: '验证码格式错误'
        }]
      },
      isCountDownShow: false
    }
  },
  methods: {
    // 请求登录
    async onSubmit () {
      // 1.获取表单数据
      const user = this.user
      // 2.表单验证

      this.$toast.loading({
        message: '登录中...',
        forbidClick: true, // 禁用背景点击
        duration: 0 // 持续时间，默认是2000，如果为0，则持续展示
      })
      // 3.提交表单，请求登录
      try {
        const { data } = await reqLogin(user)
        this.$store.commit('SETUSER', data.data)
        this.$toast.success('登陆成功')
      } catch (err) {
        if (err.response.status === 400) {
          this.$toast.fail('手机号或验证码错误')
        } else {
          this.$toast.fail('登录失败，请稍后重试')
        }
      }
      // 4.根据请求响应结果处理后续操作
    },
    // 点击发送验证码
    async onSendSms () {
      // 1.验证手机号
      try {
        await this.$refs.userForm.validate('mobile')
      } catch (err) {
        return console.log('验证失败', err)
      }

      // 2.验证通过，显示倒计时
      this.isCountDownShow = true

      // 3.发送验证码
      try {
        await reqSendSms(this.user.mobile)
        this.$toast.success('发送验证码成功')
      } catch (err) {
        // 发送失败，关闭倒计时
        this.isCountDownShow = false
        if (err.response.status === 429) {
          this.$toast.fail('发送太频繁了，请稍后重试')
        } else {
          this.$toast.fail('发送失败，请稍后重试')
        }
      }
    }
  }
}
</script>

<style lang="less" scoped>
  .login-container {
    .iconfont {
      font-size: 37px;
    }

    .send-sms-btn {
      width: 160px;
      height: 46px;
      line-height: 46px;
      background-color: #ededed;
      font-size: 22px;
      color: #666;
    }

    .login-btn-wrap {
      padding: 53px 33px;
      .login-btn {
        background-color: #6db4fb;
        border: none;
      }
    }
  }
</style>
