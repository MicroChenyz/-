var app = getApp()
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
    url: 'http://172.20.10.6:5000/admin',
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
        {"me":false, "text":"hello!"},
        {"me":true, "text":"nice to meet to you!\nnice to meet to you!nice to meet to you!nice to meet to you!"},
        {"me":true, "text":"nice to meet to you!\nnice to meet to you!nice to meet to you!nice to meet to you!"},
        {"me":true, "text":"nice to meet to you!\nnice to meet to you!nice to meet to you!nice to meet to you!"},
        {"me":true, "text":"nice to meet to you!\nnice to meet to you!nice to meet to you!nice to meet to you!"},
        {"me":true, "text":"nice to meet to you!\nnice to meet to you!nice to meet to you!nice to meet to you!"},
        {"me":true, "text":"nice to meet to you!\nnice to meet to you!nice to meet to you!nice to meet to you!"},
        {"me":true, "text":"nice to meet to you!\nnice to meet to you!nice to meet to you!nice to meet to you!"},
    ];
}
function sendMessage(msg, obj){
    // wx.request({
    //         url: app.globalData.ip+'/getMoments.php',
    //         data: {'msg':msg, 'userid':app.globalData.userInfo.userId, 'username':app.globalData.userInfo.userName},
    //         method: "POST",
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //         success: function(res) {
    //          obj.setData({
    //             messages:obj.data.messages.concat([{"me":false,"text":res.data}]),
    //             toView: "msg-" + obj.data.messages.length,
    //          });
    //         },
    //         fail:function(err){
    //             console.log(err);
    //         }
    //     })
    var reply = "I dont't know,sb"
    obj.setData({
      messages:obj.data.messages.concat([{"me":false,"text":reply}]),
      toView: "msg-" + obj.data.messages.length,
    });
}
function loadComments(obj){
    // wx.request({
    //         url: app.globalData.ip+'/getMoments.php',
    //         data: {},
    //         method: "POST",
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //         success: function(res) {  
    //          obj.setData({
    //             comments:[{"comment_id":1, "username":"wanfu", "content":"nice", "time":"20200202 11:11:11", "checked":true, "view_count":10, "agree_count":15, "reply":"nmd", "opacity":1, "anim":null}],
    //             isLoading:false
    //          });
    //         },
    //         fail:function(err){
    //             console.log(err);
    //         }
    //     })

  obj.setData({
    comments:[{"comment_id":1, "username":"wanfu", "content":"nice", "time":"2020/02/02 11:11:11", "checked":true, "view_count":10, "agree_count":15, "reply":"nmd", "reply_time":"2020/02/02 11:12:10", "z_index_front":2, "anim":null}],
    isLoading:false
  })
}
function sendComment(comment){
      // wx.request({
    //         url: app.globalData.ip+'/getMoments.php',
    //         data: {'comment':comment},
    //         method: "POST",
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //         success: function(res) {
    //         },
    //         fail:function(err){
    //             console.log(err);
    //         }
    //     })
  console.log(comment)
}
function sendReply(single_comment){
  // wx.request({
//         url: app.globalData.ip+'/getMoments.php',
//         data: {'comment':comment},
//         method: "POST",
//         header: {
//             'Content-Type': 'application/json'
//         },
//         success: function(res) {
//         },
//         fail:function(err){
//             console.log(err);
//         }
//     })
console.log(reply)
}
function addMovie(movie_info){
    //  wx.request({
    //         url: app.globalData.ip+'/getMoments.php',
    //         data: {'movieinfo':movie_info},
    //         method: "POST",
    //         header: {
    //             'Content-Type': 'application/json'
    //         },
    //         success: function(res) {
    //         },
    //         fail:function(err){
    //             console.log(err);
    //         }
    //     })
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
  loginUser: loginUser
}
