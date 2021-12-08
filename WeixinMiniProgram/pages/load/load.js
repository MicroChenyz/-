var app = getApp()
var util = require('../../utils/util.js')
Page({
      /** 页面的初始数据 */
      data: {
            show_login_button: false,//初始不显示登录按钮 
            count: 3,//倒计时秒数
            show_skip_button:false,//初始不显示跳过按钮 
            show_load_button:false
      },
      //初始化进入程序
      onLoad() {
        this.loadToApplet()
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
      onLogin(userInfo){
        util.loadMessage();
        util.loginUser(userInfo);
        this.show_button(1);
        this.countDown();
      },
      bindGetUserInfo: function(e) {
        var that = this;
        wx.getUserProfile({
            desc:'正在获取',//不写不弹提示框
            success:function(res){
                app.globalData.userInfo = {
                    "userName":res.userInfo.nickName,
                    "isAdmin":false,
                    "userId":app.globalData.userId,
                  },
                that.onLogin(res.userInfo)
                console.log('获取成功: ',res)
            },
            fail:function(err){
              console.log("获取失败: ",err)
            }
          })
    },
    loadToApplet(){
        var that = this;
        wx.login({
            success (res) {
              if (res.code) {
                //发起网络请求
                console.log("res.code:"+res.code)
                wx.request({
                    url: app.globalData.ip + 'login',
                    data: {'code':res.code},
                    method: "POST",
                    header: {
                        'Content-Type': 'application/json'
                    },
                    success: (open) => {
                        console.log(open.data.openid)
                        var userInfo = wx.getStorageSync(open.data.openid);
                        app.globalData.userId = open.data.openid;
                        if(userInfo){
                            app.globalData.userInfo = userInfo;
                            that.onLogin(userInfo);
                        }else{
                            that.setData({
                                show_login_button:true
                            })
                        }
                    },
                    fail: (err) => {
                        that.setData({
                            show_load_button:true
                        })
                        wx.showToast({
                            title: '服务接口请求失败',
                            icon: 'none',
                            duration: 3000
                        });
                    }
                })
              } else {
                this.setData({
                    show_load_button:true
                })
                wx.showToast({
                    title: '登录失败！' + res.errMsg,
                    icon: 'none',
                    duration: 3000
                });
              }
            },
            fail (err){
                that.setData({
                    show_load_button:true
                })
                wx.showToast({
                    title: '登录失败！' + err,
                    icon: 'none',
                    duration: 3000
                });
            }
          })
    }
})