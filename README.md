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
        4.点击登录页面，登录之后要跳转回该页面 $router.back()
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

## 3.首页
### 一、处理文章频道列表
    1）头部导航栏
        1.使用导航栏组件
        2.在导航栏中 插入按钮，用插槽slot="title"
        3.样式调整
    2）使用Tab标签页组件
        1.加上切换动画效果 animated
        2.滑动切换 swipeable
    3）样式调整
        1.基础样式调整  -标签项 -底部条
          如果加上类名未起作用，可能是组件层级比较多，考虑深度选择器 /deep/ 或者 >>>
        2.处理汉堡按钮
            1.使用插槽加上 icon 图标，在div盒子里
            2.设置图标及div盒子样式
            3.使用伪元素 设置渐变框
            4.添加占位符充当内容区域
                标签页最后一个标签被挡住  flex-shrink:0 不参与flex布局空间计算
    4）获取数据展示
        1.写接口函数
        2.在created中调用函数
        3.将获取到的数据channels存储在data中，并展示
### 二、展示文章列表
    1）创建列表组件 ArticleList
        --props传递数据channel给ArticleList组件
    2）使用list列表组件
        1.给home页面加一个padding-bottom，是列表 加载中... 能全部显示出来
        2.了解组件中load事件，loading。finished属性
    3）请求获取数据
    4）请求失败的处理
        --List列表的错误提示
    5）下拉刷新
        1.用到【PullRefresh 下拉刷新】组件
        2.下拉刷新事件：
            （1）请求获取数据
            （2）将数据追加到列表的顶部
            （3）关闭下拉刷新的loading状态
        3.刷新成功提示 
            --更新了xx条数据
        4.设置刷新展示时长 success-duration
        5.刷新失败提示
    6）头部固定定位
        1.导航栏固定 fixed
        2.频道列表固定 --固定定位
        3.文章内容被遮住，给home页添加padding-top
    7）记住文章列表的滚动位置
        为什么列表滚动会互相影响？
        因为它们并不是在自己内部滚动，而是整个body页面在滚动。无论你是在a频道还是在b频道，其实滚动的都是body元素。
        一个小技巧：如何快速找到是哪个元素产生的滚动？
        把下面这段代码粘贴到调试工具中运行一下，然后滚动页面，就可以看到是哪个元素产生的滚动了。
        function findScroller(element) {
            element.onscroll = function() {console.log(element)}
            Array.from(element.children).forEach(findScroller)
        }
        findScroller(document.body)
    
        怎么解决？
        --让每个标签内容文章列表产生自己的滚动容器，这样就不会相互影响了。
        如何让标签内容文章列表产生自己的滚动容器？
        固定高度： height: xxx;
        溢出滚动：overflow-y: auto;
    
        然后我们给文章列表组件的根节点设置如下：
        .articlr-list {
            height: 100%;
            overflow-y: auto;
        }
        但是我们发现设置高100%的话没有作用，这是
        因为百分比是相对于父元素，而我们审查元素发现它所有的父元素都没有高，那肯定就没有作用了。
        另一种方式：CSS新增的视口单位：vw 和vh。 根据浏览器窗口的大小单位，不受父元素影响。
        PS:在移动端，视口单位相当于布局视口。
        1vw = 可视窗口宽度的百分之一，比如窗口宽度是750，则1vw = 7.5px
        1vh = 可视窗口高度的百分之一，比如窗口宽度是667，则1vw = 6.67px
        .article-list {
            height: 79vh;
            overflow-y: auto;
        }
### 三、文章列表项
    1）准备组件ArticleItem
    2）展示列表项内容
        --【Cell 单元格】进行修改
        --插槽slot="title"自定义左侧title  --标题
        --插槽slot="label"自定义标题下方 label 的内容 --图片3张 + 作者名|评论|时间
        --插槽slot="default"自定义右侧 value 的内容  --图片1张
    3）样式调整
        1.标题和图片布局：flex弹性布局
          右侧图片设置宽高（短边填充fit="cover），剩余的空间给文字部分
        2.设置最多显示2行，多于部分省略 【Style内置样式】
        3.底部文本信息
        4.3张图片样式
            --选择子代，但不要最后一个用 :not(:last-child)
    4）关于第三方图片403问题
    
    5）处理相对时间
        1.推荐两个第三方库：
            Moment.js
            Day.js
        两者都是专门用于处理时间的JavaScript库，功能差不多，因为Day.js的设计就是参考Moment.js。但是Day.js相比Moment.js 的打包体积要更小一点，因为它采用了插件化的处理方式。
        Day.js 是一个轻量的处时间和日期的JavaScript库，和 Moment.js 的API设计保持完全一样。
        2.相对时间
            (1)定义一个全局过滤器filter，然后就可以在任何组件的模板中使用了
            // 其实过滤器就相当于一个全局可用的方法（仅供模板使用）
            // 参数1：过滤器名称； 参数2：过滤器函数
            // 使用方式：{{ 表达式 | 过滤器名称 }}
            // 管道符前面的表达式会 作为参数传递到过滤器函数中
            // 过滤器的返回值会渲染到使用过滤器的模板位置
            Vue.filter('relativeTime', value => {
            return dayjs().to(dayjs(value))
            })
            (2)模板中
             <span>{{ article.pubdate | relativeTime}}</span>
### 四、频道编辑
    1）使用【Popup 弹出层】组件  -底部弹出
    2）创建频道编辑组件ChannelEdit
        1.页面布局
            【cell单元格】+ 插槽
            【grid宫格】
        2.样式调整
            1.标题+编辑按钮
            2.grid宫格设置
            3.宫格里的文字设置为：不折行 white-space: nowrap;
            4.我的频道：右上角小图标
    3）展示我的频道
        1.父子组件通信props，传递channels给channel-edit
        2.my-gird收到数据，渲染到页面
    4）处理激活频道高亮
        1.将首页频道列表的active属性传递给频道编辑
        2.频道编辑组件，动态设置text的样式，如果索引值和active一致，则显示该样式
        3.v-bind:class="{active: index === active}" 语法
    5）展示频道编辑
        没有用来获取所有频道的接口，但是有获取所有频道列表的接口。
        因此：所有频道列表 - 我的频道 = 剩余推荐频道
        1.获取所有频道
        --写接口函数，获取数据allChannels
        2.计算出 剩余推荐频道
        --用到数据的方法，forEach,find  || filter + find方法
        3.将频道推荐数据 渲染到页面
    6）添加频道
        给频道推荐每一项 添加点击事件onAddChannel，将该channel添加到myChannel数组
    7）处理编辑状态
        1.将icon图标改为插槽形式 van-icon
        2.将van-icon 父节点定位取消，isEdit控制显示与隐藏
        3.编辑按钮，添加点击事件
        4.推荐频道 （--不允许被删除） fixChannels 固定属性
    8）切换频道
        非编辑状态，执行切换频道
        1.频道编辑组件 给父组件home传递 更新状态 的数据
        2.切换频道后，弹出层隐藏
    9）删除频道
        编辑状态，执行删除频道
        1.myChannel数组 splice方法，删除频道项
        2.注意：当index <= this.active时，需要传递数据给父组件，active-1
        3.自定义事件，添加第3个参数，true，控制弹出层的显示与隐藏
        4.判断，如果是推荐频道，则不能触发该点击事件了
    10）数据持久化
        频道编辑这个功能，无论用户是否登录，用户都可以使用。
        不登录也可以使用：
            -数据存储在本地
            -不支持同步功能
        登录也能使用：
            -数据存储在线上后台服务器
            -更换不同设备可以同步数据
        1.添加频道
            -如果未登录，则存储到本地
            -如果已登录，则存储到线上
                -找到接口、封装请求方法、发请求
        2.删除频道 -与添加频道类似
    11）正确获取展示首页频道列表
        开始-》是否已登录 -》是：请求获取用户频道数据
                         -》否：是否有本地村存储频道列表 -》 是：获取使用
                                                       -》 否：请求获取推荐频道数据
## 4.文章搜索
### 一、页面布局
    1）创建组件并配置路由
        1.创建一级路由search
        2.home页，搜索按钮，点击跳转到search页
    2）页面布局-搜索栏
        【Search 搜索】组件
    3）页面布局-完成
        1.search-history组件  --【cell单元格】
        2.search-suggestion组件
        3.search-result组件  --【list列表】
    4）处理页面展示逻辑 
        v-if
        v-else-if
        v-else
        isResultShow参数 控制搜索结果的显示与隐藏
### 二、联想建议
    1）将父组件 搜索框 输入的内容传给 联想建议子组件
      
    2）在子组件中【监视】搜索框输入内容的变化，如果变化则请求获取联想建议数据
        watch  
        immediate: true, //该回调将会在侦听开始之后被立即调用
    3）将获取的数据展示到列表中
    4）优化防抖
        1.安装loash插件 npm i lodash
        2. handler: debounce(function (val) {
                this.loadSearchSuggestion(val)
            }, 500)
    5）搜索关键字高亮
        1.<!-- 使用v-html 指令可以绑定渲染带有html标签的字符串 -->
        <div v-html="htmlStr"></div>
    
        htmlStr: 'Hello <span style="color:red"> World </span>'
        2.用到字符串的replace()方法
        3.正则表达式
### 三、搜索结果
    1）传递搜索内容
        在联想建议里 选择的搜索词，传递给父组件 自定义事件
        父组件的textItem传递给搜索结果组件  props
    2）搜索结果展示
        1.【list列表】组件
        // 1.请求获取数据
        // 2.将数据添加到数组列表中
        // 3.将本次加载中的loading关闭
        // 4.判断是否还有数据
        //    如果有，则更新获取下一个数据的页码
        //    如果没有，则将加载状态finished设置为结束
        2.错误提示
        3.顶部搜索栏 固定定位；
            给搜索容器加 上内边距
## 5.文章详情
### 一、页面内容
    1）创建组件并配置路由
        article路由路径设置为： 动态路由
        {
            path: '/article/:articleId',
            name: 'article',
            component: () => import('@/views/article')
        }
    2）使用组件props解耦路由参数
    3）页面布局
    4）请求获取文章数据（404）
        关于后端返回数据的大数字问题：
        jsonStr = '{"art_id": 1245953273786007552}'
    
        【json-bigint插件】 --可以解决数据中超出JavaScript 安全整数范围的问题
        JSONBig.parse 把BigNumber类型的数据转为字符串来使用
        JSONBig.parse(jsonStr)
        JSONBig.parse(jsonStr).art_id.toString()    //1245953273786007552
        JSONBig.stringify 把JSON格式的字符串转为 对象形式
        JSONBig.stringify( JSONBig.parse(jsonStr))   "art_id": 1245953273786007552
    5）展示文章详情
    6）处理内容加载状态
        1.v-if
        v-else-if
        v-else
        2.引入2个data数据:
            loading: true, //加载中的loading状态
            errStatus: 0  //失败的状态码
    7）关于文章正文的样式 
       1.【github-markdown】适配移动端的样式,大小px不需要转换
       2.在.postcssrc.js 做排除配置 exclude
    8）图片点击预览
        1.使用【ImagePreview】组件
        2.使用步骤
            1.得到所有的img节点
            2.获取所有img地址
            3.给每个img注册点击事件，在处理函数中调用预览
### 二、关注用户  
        1.关注 和 已关注 通过v-if v-else 控制显示
        2.关注/取消关注用户
            --找到数据接口
            --封装请求方法
            --请求调用
            --视图更新
        3.注册同一个点击事件，根据this.article.is_followed判断，分别发请求，成功后，将关注状态取反
        4.用户不能关注自己，会提示400
            在错误提示中，加提示消息“不能关注你自己”
        5.给按钮添加loading效果
            --添加followLoading属性
            --发请求前和后 分贝开启，关闭loading效果
        6.组件封装
            1.父传子
            2.子传父
        7.在组件上使用v-model
            1.当我们传递给子组件的数据既要使用还要修改。
            传递：props     :isFollowed="article.is_followed"
            修改：自定义事件   @updateIsFollowed="article.is_followed = $event"
            简写方式：在组件上使用v-model
              value="article.is_followed"
              @input="article.is_followed = $event"
            等价于v-model="article.is_followed"
            2.如果需要修改v-model的规则名称，可以通过子组件的model属性修改
            3.一个组件上只能使用一次v-model
            如果有多个数据需要实现类似于v-model的效果？咋办
            可以使用属性的 .sync 修改符
### 三、文章收藏
        1.准备组件 CollectArticle
        2.视图处理
### 四、文章点赞

##  6.文章评论
#### 1）准备组件  【List列表】

#### 2）展示文章评论列表

#### 3）展示文章评论总数量

​    1.评论列表组件 传递 total_count 给父组件  --自定义事件
​    2.list列表只有展示出来才会加载数据，可以在created中就调用onLoad()

#### 4）评论列表项组件 commentItem

#### 5）评论点赞视图处理

​    1.通过comment.is_liking判断，是否显示红心 或 空心
​    2.样式添加:class="{liked: comment.is_liking}"

#### 6）评论点赞功能处理

​    1.评论点赞 --添加点击事件
​    2.编辑 是否点赞is_liking + 点赞数量like_count

#### 7）发布文章评论

​    1.准备弹出层 【Popup 弹出层】
​    2.封装组件 comment-post
​    3.发布文章评论
      --找到数据接口
      --封装请求方法
      --注册发布点击事件
      --请求发布
        --成功：
            ①commen-post 传递data.data 给父组件article，@post-success="onPostSuccess"
                ②同时把 comment-list 传递list 给父组件 为commentList
            关闭弹出层
            将发布内容展示到列表中
            清空文本框
           
        --失败：提示失败
       --发布按钮 禁用设置 【文本框输入为空时，即字符串长度为0】
       v-model.trim="message"
       按钮：:disabled="!message.length"

​    4.文章评论点赞


## 7.编辑用户资料
#### 一、创建页面并配置路由
#### 二、页面布局
        1.导航栏
        2.个人信息
#### 三、展示用户信息
        找到接口数据
        封装请求方法
        请求获取数据
        模板绑定
#### 四、修改昵称
        1.使用【Popup 弹出层】
        2.将修改昵称模块封装成组件 update-name
        3.设置弹出层样式
        4.数据处理 v-model
        5.子组件update-name，用v-if控制显示与隐藏
        6.处理完成 按钮
            1.完成按钮 --发请求获取数据，传递给父组件
            2.加上loading效果
#### 五、修改性别
        1.使用【Popup 弹出层】
        2.【Picker 选择器】
          <van-picker
            title="标题"
            show-toolbar
            :columns="columns"
            :default-index="value"
            @confirm="onConfirm"
            @cancel="$emit('close')"
            @change="onChange"
        />
#### 六、修改生日
        1.使用【Popup 弹出层】
        2.【DatetimePicker 时间选择】
        3.使用dayjs将日期转成特定格式的字符串
#### 七、修改头像
        1.图片上传预览
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
        2.图片预览样式处理
#### 八、图片裁切（初始化）
        1.-----【cropperjs】插件
        2.如果是基于服务端的裁切，则使用getData方法，该方法得到裁切的区域参数。

        如果是纯客户端的图片裁切，则使用 getCroppedCanvas方法，该方法得到裁切之后的图片对象（类似于URL.createObjectURL 方法选择的文件对象）。
        3.处理完成按钮