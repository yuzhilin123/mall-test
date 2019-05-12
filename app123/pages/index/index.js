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
    isShowed: false
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
    var wrap = document.getElementById('wrap');
    var start = document.getElementById('text_2');
    var startWidth = getStyle(text_2, 'width');
    function move() {
      wrap.scrollLeft++;
      if (wrap.scrollLeft >= startWidth) {
        wrap.scrollLeft = 0;
      }
    }
    var timer = window.setInterval(move, 10);
    box.onmouseover = function () {
      window.clearInterval(timer);
    };
    box.onmouseout = function () {
      timer = window.setInterval(move, 10);
    };

    // 获取css的值
    function getStyle(ele, attr) {
      var val = null, reg = null;
      if (window.getComputedStyle) {
        val = window.getComputedStyle(ele, null)[attr];
      } else {
        val = ele.currentStyle[attr];
      }
      reg = /^(-?\d+(\.\d+)?)(px|pt|rem|em)?$/i; // 正则匹配单位,若带有px等单位，将单位剔除掉
      return reg.test(val) ? parseFloat(val) : val;
    }
   
  },
  onShow: function() {

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