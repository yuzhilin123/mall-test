// pages/personal_center/personal_center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xinagqingyeData: {},
    showPrice: {},
    likeHidden: true,
    unlikeHidden: false,
    animationInfo: {},
    animationOpacity: 1
  },
  goShouye: function(event) {
    wx.switchTab({
      url: "../../index/index"
    })
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    wx.showLoading({
      title: '加载中',
    })
    let id = options.id;

    var that = this;
    that.setData({
      showPrice: id
    });
    wx.request({
      url: "http://rap2api.taobao.org/app/mock/167390/index/detail/?+id=${id}", //详情页数据
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data.code === 0) {
          // console.log(res.data)
          that.setData({
            xinagqingyeData: res.data.data
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
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {
    var animation = wx.createAnimation();
    this.setData({
      // 导出动画效果到页面
      animationInfo: animation.export()
    });
  },


  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */


  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})