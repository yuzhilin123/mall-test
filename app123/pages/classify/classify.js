Page({
  data: {
    navLeftItems: [],
    navRightItems: [],
    curNav: 1,
    curIndex: 0
  },
  onLoad: function () {
    // 加载的使用进行网络访问，把需要的数据设置到data数据对象
    var that = this
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/167390/index/classify',
      header: {
        'Accept': 'application/json'
      },
      success: function (res) {
        if(res.data.code===0){
          console.log(res.data.data)

          that.setData({
            navLeftItems: res.data.data,
            navRightItems: res.data.data
          })
        }
      }
    })
  },
 
  //事件处理函数
  switchRightTab: function (e) {
    // 获取item项的id，和数组的下标值
    // let id = e.target.dataset.name;
    // console.log(id)
    let  index = parseInt(e.target.dataset.index);
    // console.log(index)
    // 把点击到的某一项，设为当前index
    this.setData({
      // curNav:id,
      curIndex: index
    })
  },
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.name;
    console.log(movieId)
    wx.navigateTo({
      url: "../index/movie-detail/movie-detail?id=" + movieId
    })
  },

})

