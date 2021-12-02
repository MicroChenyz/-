var app = getApp()
Page({
    data: {
        userInfo:{},
        backdoor:false,
        movie_info:{
            movie_name:"",
            movie_intro:"",
            movie_actors:"",
            movie_type:null,
            movie_date:null,
        }
    },
    onLoad: function () {
        //调用应用实例的方法获取全局数据
        this.setData({
            userInfo:app.globalData.userInfo
        })
    },
    toBackdoor(){
        if(this.data.userInfo.isAdmin){
            if(this.data.backdoor){
                this.setData({
                    backdoor:false
                })
            }else{
                this.setData({
                    backdoor:true
                })
            }

        }
    },
    check_pass(movie_info){
        if(movie_info.movie_name.length == 0){
            wx.showToast({
                title: '请填写电影名称',
                icon: 'none',
                duration: 1000
            });
            return false;
        }
        if(movie_info.movie_intro.length == 0){
            wx.showToast({
                title: '请填写电影简介',
                icon: 'none',
                duration: 1000
            });
            return false;
        }
        if(movie_info.movie_actors.length == 0){
            wx.showToast({
                title: '请填写电影演员',
                icon: 'none',
                duration: 1000
            });
            return false;
        }
        if(movie_info.movie_type == null){
            wx.showToast({
                title: '请选择电影类型',
                icon: 'none',
                duration: 1000
            });
            return false;
        }
        if(movie_info.movie_date == null){
            wx.showToast({
                title: '请选择电影上映日期',
                icon: 'none',
                duration: 1000
            });
            return false;
        }
        return true;
    },
    formSubmit(e) {
        var movie_info = this.data.movie_info
        if(this.check_pass(movie_info)){

        }
    },
    inputMovieName(e){
        this.setData({
            ["movie_info.movie_name"]:e.detail.value
        })
    },
    inputMovieIntro(e){
        this.setData({
            ["movie_info.movie_intro"]:e.detail.value
        })
    },
    inputMovieActors(e){
        this.setData({
            ["movie_info.movie_actors"]:e.detail.value
        })
    },
    selectMovieType(e){
        this.setData({
            ["movie_info.movie_type"]:e.detail.value
        })
    },
    selectMovieDate(e){
        this.setData({
            ["movie_info.movie_date"]:e.detail.value
        })
    }
})
