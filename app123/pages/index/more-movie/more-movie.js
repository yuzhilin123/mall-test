// pages/movies/more-movie/more-movie.js
var app = getApp()

Page({
  data: {
    movies: {},
    navigateTitle: "",
    requestUrl: "",
    totalCount: 0,
    isEmpty: true,
  },
  onLoad: function (options) {
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
          console.log(res.data)
          that.setData({
            movies: res.data.data
          })
          
        }
      }
    });
   
  },

  // onScrollLower: function (event) {
  //   var nextUrl = this.data.requestUrl +
  //     "?start=" + this.data.totalCount + "&count=20";
  //   util.http(nextUrl, this.processDoubanData)
  //   wx.showNavigationBarLoading()
  // },

  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  onPullDownRefresh: function (event) {
    var refreshUrl = this.data.requestUrl +
      "?star=0&count=20";
    this.data.movies = {};
    this.data.isEmpty = true;
    this.data.totalCount = 0;
    util.http(refreshUrl, this.processDoubanData);
    wx.showNavigationBarLoading();
  },

  processDoubanData: function (moviesDouban) {
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      // [1,1,1,1,1] [1,1,1,0,0]
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      }
      movies.push(temp)
    }
    var totalMovies = {}

    //如果要绑定新加载的数据，那么需要同旧有的数据合并在一起
    if (!this.data.isEmpty) {
      totalMovies = this.data.movies.concat(movies);
    }
    else {
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies: totalMovies
    });

    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh()
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