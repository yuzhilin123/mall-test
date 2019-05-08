// pages/movies/more-movie/more-movie.js
var app = getApp()
Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
    dataUr:""
  },
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    var category = options.category;
    this.data.navigateTitle = category;
    var dataUrl = "";
    switch (category) {
      case "分类栏目1":
        dataUrl = "http://rap2api.taobao.org/app/mock/167390/index/moreimage";
        break;
      case "分类栏目2":
        dataUrl = 'http://rap2api.taobao.org/app/mock/167390/index/2';
        break;
      case "分类栏目3":
        dataUrl = 'http://rap2api.taobao.org/app/mock/167390/index/3';
        break;
    }
    // console.log(dataUrl)
    var that = this;
    that.setData({
      dataUr: dataUrl
    })
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
    // this.data.requestUrl = dataUrl;
     var that=this;
    wx.request({
      url: dataUrl, // 仅为示例，并非真实的接口地址
      header: {
        'content-type': 'application/json' // 默认值
      },
      success(res) {
        if (res.data.code === 0) {
          // console.log(res.data)
          that.setData({
            movies: res.data.data
          })
          
        }
      },
      complete() {
        wx.hideLoading()
      }
    });
   
  },
  
  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

 

  

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    })
  },

  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../movie-detail/movie-detail?id=' + movieId
    })
  },
  
})
