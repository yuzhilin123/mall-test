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
    check_length:'',

    animationData: {}, //公告动画
    announcementText: "华友商城小程序正式上线了！电脑打印机监控网络上门服务报修电话：05434343234",//公告内容
    text: "华友商城小程序正式上线了！电脑打印机监控网络上门服务报修电话：05434343234",
  
    marqueePace: 1,//滚动速度
    marqueeDistance: 0,//初始滚动距离
    marquee_margin: 30,
    size: 14,
   
     interval: 20,
    text: '华友商城小程序正式上线了！电脑打印机监控网络上门服务报修电话：05434343234',
    pace: 1.2, //滚动速度
    interval: 20, //时间间隔
    size: 24, //字体大小in px
    length: 0, //字体宽度
    offsetLeft: 0, //
    windowWidth: 0,
    notice_content: '公告字幕滚动播放（文字跑马灯效果）,,,,,,,,使用动画和定时器完成，代码片段是一种迷你、',
    animationData: {}, //公告动画



  },

  onReachBottom: function(e) {
    // console.log('asdfasdfd')

  },

  
  onLoad: function(event) {
    let that = this;
   
    


    
    
    wx.showLoading({
      title: '加载中',
    })
    
   
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
 
  
   
   
   
    //创建动画实例
    var animation = wx.createAnimation({
      //此处以公告最长内容来设置动画持续时间（duration：决定整个动画播放的速度）
      duration: 20000,
      timingFunction: 'linear'
    });
    //偏移距离为公告内容的长度*字体大小（若字体大小使用rpx需要换算成px）
    animation.translate(-Number( this.data.announcementText.length*16), 0).step();
    this.setData({
      animationData: animation.export()
    });
    // 循环播放动画关键步骤（使用两个定时器）
    // 第一个定时器：将字幕恢复到字幕开始点（为屏幕左边）
    this.recoveraAnimation = setInterval(function () {
      animation.translate(280, 0).step({ duration: 0 });
      this.setData({
        animationData: animation.export()
      });
    }.bind(this), 20000);
    // 第二个定时器：重新开始移动动画
    this.restartAnimation = setInterval(function () {
      animation.translate(-Number(this.data.announcementText.length*16), 0).step();
      this.setData({
        animationData: animation.export()
      });
    }.bind(this), 20001);
    

  },


 
  
  // onShow: function () {
  //   var that = this;
  //   var length = that.data.text.length * that.data.size;//文字长度
  //   var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
  //   //console.log(length,windowWidth);
  //   that.setData({
  //     length: length,
  //     windowWidth: windowWidth
  //   });
  //   that.scrolltxt();// 第一个字消失后立即从右边出现
  // },

  // scrolltxt: function () {
  //   var that = this;
  //   var length = that.data.length;//滚动文字的宽度
  //   var windowWidth = that.data.windowWidth;//屏幕宽度
  //   if (length > windowWidth) {
  //     var interval = setInterval(function () {
  //       var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
  //       var crentleft = that.data.marqueeDistance;
  //       if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
  //         that.setData({
  //           marqueeDistance: crentleft + that.data.marqueePace
  //         })
  //       }
  //       else {
  //         //console.log("替换");
  //         that.setData({
  //           marqueeDistance: 0 // 直接重新滚动
  //         });
  //         clearInterval(interval);
  //         that.scrolltxt();
  //       }
  //     }, that.data.interval);
  //   }
  //   else {
  //     that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
  //   }
  // },

  //   var that = this;
  //   var length = that.data.text.length * that.data.size;//文字长度
  //   var windowWidth = wx.getSystemInfoSync().windowWidth;// 屏幕宽度
  //   //console.log(length,windowWidth);
  //   that.setData({
  //     length: length,
  //     windowWidth: windowWidth
  //   });
  //   that.scrolltxt();// 第一个字消失后立即从右边出现
  // },

  // scrolltxt: function () {
  //   var that = this;
  //   var length = that.data.length;//滚动文字的宽度
  //   var windowWidth = that.data.windowWidth;//屏幕宽度
  //   if (length > windowWidth) {
  //     var interval = setInterval(function () {
  //       var maxscrollwidth = length + that.data.marquee_margin;//滚动的最大宽度，文字宽度+间距，如果需要一行文字滚完后再显示第二行可以修改marquee_margin值等于windowWidth即可
  //       var crentleft = that.data.marqueeDistance;
  //       if (crentleft < maxscrollwidth) {//判断是否滚动到最大宽度
  //         that.setData({
  //           marqueeDistance: crentleft + that.data.marqueePace
  //         })
  //       }
  //       else {
  //         //console.log("替换");
  //         that.setData({
  //           marqueeDistance: 0 // 直接重新滚动
  //         });
  //         clearInterval(interval);
  //         that.scrolltxt();
  //       }
  //     }, that.data.interval);
  //   }
  //   else {
  //     that.setData({ marquee_margin: "1000" });//只显示一条不滚动右边间距加大，防止重复显示
  //   }



  
 
  onUnload: function () {
    //清除定时器
   
    // clearInterval(this.recoveraAnimation);
    // clearInterval(this.restartAnimation);
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
      url: app.serverUrl + "/index/carousels",
      method: "POST",
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
      url: app.serverUrl + "/index/items/new",
      method: "POST",
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
      url: app.serverUrl + "/index/items/rec",
      method: "POST",
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
  

  onBindConfirm: function(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + "/v2/movie/search?q=" + text;
    this.getMovieListData(searchUrl, "searchResult", "");
  }
})
