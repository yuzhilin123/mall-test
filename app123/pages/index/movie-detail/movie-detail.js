// pages/personal_center/personal_center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xinagqingyeData:{},
    fenleilanmu:{}
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    let id = options.id;
    // console.log(id)
    var that = this;
    that.setData({
      fenleilanmu: id
    });
    wx.request({
      url: "http://rap2api.taobao.org/app/mock/167390/index/detail/?+id=${id}",//详情页数据
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
    // 显示顶部刷新图标
    wx.showNavigationBarLoading();
    var that = this;
    wx.request({
      url: 'http://rap2api.taobao.org/app/mock/167390/index/detail/?+id=${id}',
      method: "GET",
      header: {
        'content-type': 'application/text'
      },
      success: function (res) {
        console.log(res.data)
        that.setData({
          xinagqingyeData: res.data.data
        });

        // 隐藏导航栏加载框
        wx.hideNavigationBarLoading();
        // 停止下拉动作
        wx.stopPullDownRefresh();

      }
    });
  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function () {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})