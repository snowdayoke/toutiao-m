## 1.登录注册
    1.登录页面
        1）全局样式：最上方登录框，页面整体的背景色
        2）login页面样式：
            Form表单插件
            Field输入框 --显示按钮：插槽slots； --插入按钮
        3）设置login页面局部样式
    2.实现基本登录功能
        1）收集表单数据：手机号、验证码
        2）表单验证
            1.给van-field组件配置rules验证规则
            2.当表单提交的时候会自动触发表单验证
                如果验证通过，会触发submit事件
                如果验证失败，不会触发submit 
            3.细节补充：type maxlength
        3）提交表单 请求登录
            【Toast轻提示】 this.$toast
    3.发送验证码
        点击onSendSms按钮：
            1.验证手机号
                点击按钮会触发表单提交？需要进行设置native-type="button"
            2.验证通过，显示倒计时 
                【CountDown倒计时组件】，开启倒计时
            3.请求发送验证码
                写请求接口函数
                    发送成功：弹出成功提示
                    发送失败：倒计时关闭，弹出错误提示信息
    4.处理用户 Token
    Token使用户登录成功之后服务端返回的一个身份令牌，在项目的多个业务中需要使用到：
     访问需要授权的API接口
     校验页面的访问权限
    但是我们只有在第一次用户登录成功之后才能拿到Token
    所以为了能在其他模块中获取到Token数据，我们需要把它存储到一个公共的位置，方便随时取用。
    往哪儿存？
        本地存储：获取麻烦，数据不是响应式
        Vuex容器(推荐)：获取方便，是响应式的
    →→→→→→ 登录成功之后，将 Token 存储到 Vuex 容器中
    →→→→→→ 为了（持久化），还需要把 Token 放到本地存储
        1）Token 处理
          --登录成功之后，将服务器返回的Token存储到Vuex仓库中
          --本地存储Token
            将对象转为字符串：JSON.stringfy()
            将字符串转为对象：JSON.parse()
        2）封装本地存储模块
            存储数据：getItem()
            获取数据：setItem()  用到try...catch...
        3）关于Token过期问题
            登录成功之后会返回2个Token：
            token: 访问令牌，有效期2小时
            refresh_token: 刷新令牌，有效期14天，用于访问令牌过期之后重新获取新的访问令牌
            我们项目接口设定的 Token 有效期是 2小时，超过有效期服务端会返回 401 表示Token令牌无效或过期了

            为什么过期时间这么短?
            为了安全，例如Token被别人盗用

            过期了怎么办？
            让用户重新登录，用户体验太差了
            使用refresh_token 解决token过期问题

            如何使用refresh_token 解决token过期问题？
## 2.个人中心
    1）TabBar模块
        父路由组件：Layout，用到【Tabbar 标签栏】  --1.完成组件页面  2.搭建路由配置
        子路由组件：home、qa、video、my
    2）页面布局-顶部未登录
        1.not-login盒子 → login-btn盒子布局【flex布局】 → img + span :点击跳转到登录页面
        2.登录页，插槽加上取消的小图标，用到$router.back() --点击退回到上一页面
    3）页面布局-顶部已登录状态
        1.user-info盒子 → base-info盒子（image组件 + span） 和 data-stats盒子【flex布局】
    4）页面布局-宫格导航
        1.【Grid 宫格】，用插槽slot设置里面的图标和文字
        2. clickable：是否开启格子点击反馈。
        3. 底部消息通知 【Cell 单元格】
    5）处理页面显示状态
        1.登录时显示：用户信息+退出登录。v-if="user" → mapState获取store中的token信息数据
        2.未登录时显示：登录/注册按钮
        3.底部“我的”，未登录时要显示为“未登录”
        4.点击登录/注册，登录之后要跳转回该页面 $router.back()
    6）用户退出登录
        1.退出提示--【Dialog 弹出框】
        2.确认退出 
            --清除登录状态（容器中的user + 本地存储中的user）
    7）展示当前登录用户信息
        1.写请求接口函数  --请求头headers里加上Token ->需要引入store
        2.在created 钩子里调用函数loaderUserInfo()，发请求获取数据
        3.获取数据成功之后，展示在页面
    8）优化设置Token
        在封装axios的request.js中，请求拦截器里，请求头headers加上Token。 --这样一旦发请求都会带上Token