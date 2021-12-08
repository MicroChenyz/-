var app = getApp()
var plugin = requirePlugin("WechatSI")
function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}
function loginUser(res){
  var userId = app.globalData.userId
  wx.request({
    url: app.globalData.ip + 'admin',
    data: {'userid':userId},
    method: "POST",
    header: {
        'Content-Type': 'application/json'
    },
    success: function(res) {
      console.log(res)
      app.globalData.userInfo.isAdmin = res.data.admin == "1"? true:false;
      wx.setStorageSync(userId, app.globalData.userInfo);
    },
    fail:function(err){
        console.log(err);
    }
})
}

function loadMessage(){
    // wx.request({
    //         url: app.globalData.ip+'/getMoments.php',
    //         data: {'userid':app.globalData.userInfo.userId},
    //         method: "POST",
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //         success: function(res) {
    //            app.globalData.preLoadMsg = res.data
    //         },
    //         fail:function(err){
    //             console.log(err);
    //         }
    //     })
    app.globalData.preLoadMsg =[
        {"me":false, "text":"你好！我是影视机器人小福，欢迎随时向我提问~"},
    ];
}
function sendMessage(msg, obj){
  wx.request({
    url: app.globalData.ip+'send_msg',
    data: {'message':msg, 'userid':app.globalData.userId},
    method: "POST",
    header: {
        'Content-Type': 'application/json'
    },
    success: function(res) {
      console.log(res)
      var reply = res.data.reply
      if(reply == null || reply.trim().length == 0){
        reply = "抱歉，数据库中缺少该部分信息，请向管理员留言"
      }
      plugin.textToSpeech({
        lang: "zh_CN",
        tts: true,
        content: reply,
        success: function(res) {
            console.log("succ tts", res.filename)   
            obj.setData({
              messages:obj.data.messages.concat([{"me":false,"text":reply,"tss":res.filename}]),
              toView: "msg-" + obj.data.messages.length,
            });
        },
        fail: function(res) {
            console.log("fail tts", res)
            obj.setData({
              messages:obj.data.messages.concat([{"me":false,"text":reply}]),
              toView: "msg-" + obj.data.messages.length,
            });
        }
      })
    },
    fail:function(err){
        console.log(err);
    }
  }) 
}
function loadComments(obj){
    wx.request({
            url: app.globalData.ip+'load_comment',
            data: {},
            method: "POST",
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {  
              console.log(res)
              var comments = res.data.list
              if(comments == null){
                comments = []
              }
              for(var i = 0; i < comments.length; i++) {
                comments[i]['z_index_front'] = 2;
                comments[i]['anim'] = null;
              }
              obj.setData({
                comments:comments,
                isLoading:false
              })
            },
            fail:function(err){
                console.log(err);
            }
        })
}
function sendComment(comment){
  wx.request({
    url: app.globalData.ip+'comment',
    data: {'comment':comment},
    method: "POST",
    header: {
        'Content-Type': 'application/json'
    },
    success: function(res) {
      console.log(res)
    },
    fail:function(err){
        console.log(err);
    }
})
}
function sendReply(single_comment){
  wx.request({
        url: app.globalData.ip+'reply',
        data: {'reply':single_comment},
        method: "POST",
        header: {
            'Content-Type': 'application/json'
        },
        success: function(res) {
          console.log(res)
        },
        fail:function(err){
            console.log(err);
        }
    })
  console.log(single_comment)
}
function addMovie(movie_info){
  console.log(movie_info)
     wx.request({
            url: app.globalData.ip+'add_movie',
            data: {'movie_info':movie_info},
            method: "POST",
            header: {
                'Content-Type': 'application/json'
            },
            success: function(res) {
              console.log(res)
            },
            fail:function(err){
                console.log(err);
            }
        })
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

module.exports = {
  formatTime: formatTime,
  loadMessage: loadMessage,
  sendMessage: sendMessage,
  loadComments: loadComments,
  sendComment: sendComment,
  loginUser: loginUser,
  sendReply: sendReply,
  addMovie: addMovie,
}
