var app = getApp();
Page({
  data: {
    shouyeData: {},
    moreimages: {},
    fenleilanmu3: {},
    fenleilanmu2: {},
    searchResult: {},
    containerShow: true,
    searchPanelShow: false,
    isShowed: false,
    animationData: {}, //公告动画
    announcementText: "华友商城小程序正式上线了！电脑打印机监控网络上门服务报修电话：05434343234",//公告内容
  },

  onReachBottom: function(e) {
    // console.log('asdfasdfd')
  },

  onLoad: function(event) {
    wx.showLoading({
      title: '加载中',
    })
    var that = this
    wx.request({
      url: app.serverUrl + "/index/carousels", // 轮播图数据
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success(res) {
        if (res.data.status === 200) {
          // console.log(res.data)
          that.setData({
            shouyeData: res.data.data
          })
        }
      },
      complete() {
        wx.hideLoading()
      }

    });
    wx.request({
       url: app.serverUrl + "/index/items/new",
      //分类栏目1数据
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success(res) {
        if (res.data.status === 200) {
          // console.log(res.data.data)
          that.setData({
            moreimages: res.data.data
          })

        }
      }
    });
    //分类栏目2 数据
    wx.request({
      url: app.serverUrl + "/index/items/rec", // 仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success(res) {
        if (res.data.status === 200) {
          // console.log(res.data)
          that.setData({
            fenleilanmu2: res.data.data
          })
        }
      }
    });
    //分类栏目3 数据
    wx.request({
      url: "http://rap2api.taobao.org/app/mock/167390/index/3",
      header: {
        'content-type': 'application/json'
      },
      
      success(res) {
        if (res.data.code === 0) {
          // console.log(res.data)
          that.setData({
            fenleilanmu3: res.data.data
            
            
          })
        }
      }
    
    });

    var that = this;
    //创建动画实例
    var animation = wx.createAnimation({
      //此处以公告最长内容来设置动画持续时间（duration：决定整个动画播放的速度）
      duration: 25000,
      timingFunction: 'linear'
    });
    //偏移距离为公告内容的长度*字体大小（若字体大小使用rpx需要换算成px）
    animation.translate(-Number(this.data.announcementText.length * 16), 0).step();
    this.setData({
      animationData: animation.export()
    });
    // 循环播放动画关键步骤（使用两个定时器）
    // 第一个定时器：将字幕恢复到字幕开始点（为屏幕左边）
    this.recoveraAnimation = setInterval(function () {
      animation.translate(295, 0).step({ duration: 0 });
      this.setData({
        animationData: animation.export()
      });
    }.bind(this), 26000);
    // 第二个定时器：重新开始移动动画
    this.restartAnimation = setInterval(function () {
      animation.translate(-Number(this.data.announcementText.length * 16), 0).step();
      this.setData({
        animationData: animation.export()
      });
    }.bind(this), 27000);
  

  
 
   
  },
  onShow: function() {

  },
  onUnload: function () {
    //清除定时器
    clearInterval(this.recoveraAnimation);
    clearInterval(this.restartAnimation);
  },
  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    // console.log(category)
    wx.navigateTo({
      url: "more-movie/more-movie?category=" + category
    })
  },


  onShowed: function(event) {
    this.setData({
      isShowed: true
    })
  },
  onHideed: function(event) {
    this.setData({
      isShowed: false
    })
  },


  onMovieTap: function(event) {
    var movieId = event.currentTarget.dataset.id;
    
    wx.navigateTo({
      url: "movie-detail/movie-detail?id=" + movieId
    })
  },


  onCancelImgTap: function(event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    })
  },

  onPullDownRefresh: function() {
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    wx.showLoading({
      title: '加载中',
    })
    var that = this;
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/167390/index/lunbotu',
      method: "GET",
      header: {
        'content-type': 'application/text'
      },
      success: function(res) {
        that.setData({
          shouyeData: res.data.data
        });

        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      },
      complete() {
        wx.hideLoading()
      }
    });
    //
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/167390/index/moreimage',
      method: "GET",
      header: {
        'content-type': 'application/text'
      },
      success: function(res) {
        that.setData({
          moreimages: res.data.data
        });

        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    });
    //
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/167390/index/2',
      method: "GET",
      header: {
        'content-type': 'application/text'
      },
      success: function(res) {
        that.setData({
          fenleilanmu2: res.data.data
        });

        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    });
    //
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/167390/index/3',
      method: "GET",
      header: {
        'content-type': 'application/text'
      },
      success: function(res) {
        that.setData({
          fenleilanmu3: res.data.data
        });

        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();
      }
    });
  },

  onBindFocus: function(event) {
    wx.navigateTo({
      url: "../search/search"
    })

  },

  // preventTouchMove:function(e){
  //   e.preventDefault(); 
  // },
  move: function() {

  },

  onBindConfirm: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  }
})
