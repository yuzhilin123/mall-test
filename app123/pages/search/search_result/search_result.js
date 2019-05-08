// pages/cart/cart.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    showName:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    wx.showLoading({
      title: '加载中',
    })
    let itemName = options.inputVal;
    var that = this
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/167390/index/moreimage', // 轮播图数据
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data.code === 0) {
          // console.log(res.data)
          that.setData({
            showName: res.data.data
          })
        }
      },
       complete() {
        wx.hideLoading()
      }
    });

    
   
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function () {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function () {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function () {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onMovieTap: function (event) {
    var movieId = event.currentTarget.dataset.id;
    wx.navigateTo({
      url: '../../index/movie-detail/movie-detail?id=' + movieId
    })
  },
  onShareAppMessage: function () {

  }
})