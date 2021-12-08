var app = getApp()
var util = require('../../utils/util.js')

Page({
  data:{
    userCode: null,
    messages:[],
    msg:"",
    toView: "msg-" + 0
  },
  onLoad:function(options){
    // 页面初始化 options为页面跳转所带来的参数
    this.setData({
        messages:app.globalData.preLoadMsg
    })
  },
  inputMessage(e) {
    this.setData({
        msg:e.detail.value
    })
  },
  cancelMessage() {
    this.setData({
        msg:""
    })
  },
  sendMessage() {
    let msg = this.data.msg;
    if (msg.trim().length == 0){
        wx.showToast({
          title: '发送内容不可以为空',
          icon: 'none',
          duration: 1000,
        });
        return
    }

    let messages = this.data.messages;
    this.setData({
        messages:messages.concat([{"me":true,"text":msg}]),
        toView: "msg-" + messages.length,
        msg:""
    });
    util.sendMessage(msg, this);
  },

  playTSS(e) {
    var currentTargetIndex = e.currentTarget.dataset.index
    var tss = this.data.messages[currentTargetIndex].tss
    console.log("tss:" + tss)
    var player = wx.createInnerAudioContext()
    player.src = tss
    player.autoplay = true
    var message = `messages[${currentTargetIndex}].tss`
    this.setData({[message]:null})
  }
})