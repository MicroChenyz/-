// pages/discuss.js
var util = require('../../utils/util.js')
var app = getApp()
var startPoint;
var isPageFirstShow = true;
var currentTargetIndex;
var z_index = {};
Page({

    /**
     * 页面的初始数据
     */
    data: {
        //按钮位置参数
        buttonTop: 0,
        buttonLeft: 0,
        windowHeight: '',
        windowWidth: '',
        //角标显示数字
        corner_data:0,
        toRemark:false,
        comments:[],

        isLoading: true,
        comment_text: "",
        isAdmin:false,

        toReply: false, //是否显示弹窗内容
        option: false, //显示弹窗或关闭弹窗的操作动画
        reply_text:""
      },

    /**
     * 生命周期函数--监听页面加载
     */
    onLoad:function(){
        //定义角标数字
        this.setData({
          corner_data:3,
          isAdmin:app.globalData.userInfo.isAdmin,
        })
        // 获取控件适配参数
        var that =this;
        wx.getSystemInfo({
          success: function (res) {
            console.log(res);
            // 屏幕宽度、高度
            console.log('height=' + res.windowHeight);
            console.log('width=' + res.windowWidth);
            // 高度,宽度 单位为px
            that.setData({
              windowHeight:  res.windowHeight,
              windowWidth:  res.windowWidth,
              buttonTop:res.windowHeight*0.70,//这里定义按钮的初始位置
              buttonLeft:res.windowWidth*0.70,//这里定义按钮的初始位置
            })
          }
        })
        util.loadComments(this);
      },

    /**
     * 生命周期函数--监听页面显示
     */
    onShow: function () {
      if(isPageFirstShow){
        isPageFirstShow = false;
      }else{
        this.data.isLoading = true;
        util.loadComments(this)
      }
    },

  //可拖动悬浮按钮点击事件
  comment_open:function(){
    //这里是点击之后将要执行的操作
    this.setData({
      toRemark:true
    })
  },
  //以下是按钮拖动事件
  buttonStart: function (e) {
    startPoint = e.touches[0]//获取拖动开始点
  },
  buttonMove: function (e) {
    var endPoint = e.touches[e.touches.length - 1]//获取拖动结束点
    //计算在X轴上拖动的距离和在Y轴上拖动的距离
    var translateX = endPoint.clientX - startPoint.clientX
    var translateY = endPoint.clientY - startPoint.clientY
    startPoint = endPoint//重置开始位置
    var buttonTop = this.data.buttonTop + translateY
    var buttonLeft = this.data.buttonLeft + translateX
    //判断是移动否超出屏幕
    if (buttonLeft+50 >= this.data.windowWidth){
      buttonLeft = this.data.windowWidth-50;
    }
    if (buttonLeft<=0){
      buttonLeft=0;
    }
    if (buttonTop<=0){
      buttonTop=0
    }
    if (buttonTop + 50 >= this.data.windowHeight){
      buttonTop = this.data.windowHeight-50;
    }
    this.setData({
      buttonTop: buttonTop,
      buttonLeft: buttonLeft
    })
  },
  buttonEnd: function (e) {
  },
  cancelComment: function() {
    if(this.data.toRemark){
      this.setData({
        toRemark:false
      })
    }
  },
  sendComment: function(){
    let comment_text = this.data.comment_text;
    if (comment_text.trim().length == 0){
        wx.showToast({
          title: '发送内容不可以为空',
          icon: 'none',
          duration: 1000
      });
      return
    }
  
    this.cancelComment();
    var time = util.formatTime(new Date());
    // 将留言发送给服务端
    var origin_comments = this.data.comments
    var new_comment = {"userid":app.globalData.userInfo.userId, "username":app.globalData.userInfo.userName, "content":comment_text, "time":time, "checked":false, "reply":null}
    util.sendComment(new_comment);

    // 将留言添加到页面
    var new_comment_item = {"username":app.globalData.userInfo.userName, "content":comment_text, "time":time, "checked":false, "reply":null, "reply_time":null, "z_index_front":2, "anim":null}
    this.setData({
      comments:origin_comments.concat([new_comment_item]),
      comment_text:""
    })
  },
  inputComment(e) {
    this.setData({
        comment_text:e.detail.value
    })
  },
    onReachBottom: function(e) {
      // 最后一页了，取消下拉功能
      // if (this.data.isLastPage) {
      //   return
      // }
      // this.loadMessage(this.data.categoryId, ++this.data.activeIndex)
    },

    turnover: function (e) {
      var comment_index = e.currentTarget.dataset.index
      currentTargetIndex = comment_index
      var checked = this.data.comments[comment_index].checked
      var isAdmin = this.data.isAdmin
      if(!checked){
        if(isAdmin){
          this.popupReplyWindow();
          return;
        }else{
          wx.showToast({
            title: '请等待管理员回复',
            icon: 'none',
            duration: 1000,
          });
          return
          }
        }
      
      var anim_type = this.data.comments[comment_index].anim
      var anim = `comments[${comment_index}].anim`
      if(anim_type != "fade"){
        this.setData({[anim]: "fade"});
      }
      else{
        var z_index_front = `comments[${comment_index}].z_index_front`
        this.setData({[anim]: "unfade", [z_index_front]:2});
      }
    },

    objEqual(a, b) {
      var aProps = Object.getOwnPropertyNames(a);
      var bProps = Object.getOwnPropertyNames(b);

      if (aProps.length != bProps.length) {
          return false;
      }

      for (var i = 0; i < aProps.length; i++) {
          var propName = aProps[i];
          var propA = a[propName];
          var propB = b[propName];
          if ( propA !== propB) {
                  return false;
          }
      }
      return true;
    },
    popupReplyWindow(){
      if (!this.data.toReply && !this.data.option) {
        this.setData({
          toReply: true,
          option: true,
        })
      }
    },
    sendReply(){
      var reply_index = currentTargetIndex
      var time = util.formatTime(new Date());
      console.log("reply_index:" + reply_index)
      var reply_to_comment = `comments[${reply_index}].reply`
      var checked_to_comment = `comments[${reply_index}].checked`
      var reply_time_to_comment = `comments[${reply_index}].reply_time`
      console.log(this.data.comments[reply_index].reply)
      this.setData({[checked_to_comment]: true, [reply_to_comment]:this.data.reply_text, [reply_time_to_comment]:time});
      util.sendReply()
      this.cancelReply()
    },
    cancelReply(){
      if (this.data.option && this.data.toReply) {
        this.setData({
          option: false,
        })
        // 关闭显示弹窗动画的内容，不设置的话会出现：点击任何地方都会出现弹窗，就不是指定位置点击出现弹窗了
        setTimeout(() => {
          this.setData({
            toReply: false,
          })
        }, 500)
      } 
    },
    inputReply(e){
      this.setData({
        reply_text:e.detail.value
    })
    },
    turnoverEnd(e){      
      var comment_index = e.currentTarget.dataset.index
      var z_index_front = `comments[${comment_index}].z_index_front`
      var anim_type = this.data.comments[comment_index].anim
      if(anim_type == "fade"){
        this.setData({[z_index_front]: 0});
      }
    },
})