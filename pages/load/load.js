var app = getApp()
var util = require('../../utils/util.js')
Page({
      /** 页面的初始数据 */
      data: {
            //判断小程序的API，回调，参数，组件等是否在当前版本可用。
            canIUse: wx.canIUse('button.open-type.getUserInfo'),
            show_login_button: false,//初始不显示登录按钮 
            count: 3,//倒计时秒数
            show_skip_button:false,//初始不显示跳过按钮 

      },
      //初始化进入程序
      onLoad() {
            var thats = this;
            // 查看是否授权
            wx.getSetting({
                success: function(res) {
                    var that = thats;
                    if (res.authSetting['scope.userInfo']) {
                        wx.getUserInfo({
                            success: function(res) {
                                // 用户已经授权过,不需要显示授权页面,所以不需要改变 shouldLogin 的值
                                // 根据自己的需求有其他操作再补充
                                // 我这里实现的是在用户授权成功后，调用微信的 wx.login 接口，从而获取code
                                wx.login({
                                    success: res => {
                                        // 获取到用户的 code 之后：res.code
                                        console.log("用户的code:" + res.code);
                                        that.onLogin(res.code);
                                        // 可以传给后台，再经过解析获取用户的 openid
                                        // 或者可以直接使用微信的提供的接口直接获取 openid ，方法如下：
                                        // wx.request({
                                        //     // 自行补上自己的 APPID 和 SECRET
                                        //     url: 'https://api.weixin.qq.com/sns/jscode2session?appid=自己的APPID&secret=自己的SECRET&js_code=' + res.code + '&grant_type=authorization_code',
                                        //     success: res => {
                                        //         // 获取到用户的 openid
                                        //         console.log("用户的openid:" + res.data.openid);
                                        //     }
                                        // });
                                    }
                                });
                            }
                        });
                    } else {
                        // 用户没有授权
                        show_button(0);
                    }
                }
            });
      },
      //延迟一秒显示跳转按钮
      show_button(type) {
        if(type){
            this.setData({
                show_skip_button: true,
                show_login_button: false
            })
        }else{
            this.setData({
                show_login_button: true,
                show_skip_button: false
            })
        }

      },
      //跳转到 tabBar 页面，并关闭其他所有非 tabBar 页面
      switchTab() {
            clearInterval(this.data.time); //清除倒计时
            wx.switchTab({
                  url: '/pages/chatroom/chatroom'
            })
      },
      //倒计时计数
      countDown: function() {
            let that = this;
            let count = that.data.count;
            that.data.time = setInterval(function() {
                  if (count > 0) {
                        count--
                        that.setData({
                              count: count
                        })
                  } else {
                        that.setData({
                              count: count
                        })
                        that.switchTab();
                        clearInterval(that.data.time)
                  }
            }, 1000)
      },
      onLogin(user_code){
        app.globalData.userCode = user_code;
        util.loadMessage(user_code);
        util.loginUser(user_code);
        this.show_button(1);
        this.countDown();
      },
      bindGetUserInfo: function(e) {
        var res = e.detail.userInfo
        if (res) {
            this.onLogin(res.code)
        } else {
            //用户按了拒绝按钮
            wx.showModal({
                title: '警告',
                content: '您点击了拒绝授权，将无法进入小程序，请授权之后再进入!',
                showCancel: false,
                confirmText: '返回授权',
                success: function(res) {
                    // 用户没有授权成功，不需要改变 shouldLogin 的值
                    if (res.confirm) {
                        console.log('用户点击了“返回授权”');
                    }
                }
            });
        }
    }
})