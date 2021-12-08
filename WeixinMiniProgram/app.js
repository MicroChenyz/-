//app.js
App({
  onLaunch: function () {
    //调用API从本地缓存中获取数据
    var logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)
  },
  globalData:{
    userId:null,
    preLoadMsg:[],
    userInfo:{
      "userName":"未登录",
      "isAdmin":false,
      "userId":null,
    },
    ip:"http://49.233.54.21:7473/",
  }
})