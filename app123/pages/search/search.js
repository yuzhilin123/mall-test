// pages/personal_center/personal_center.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    searchPanelShow: false,
    inputShowed:false,
    inputVal:"",
    searchRecord: []
    // containerShow: false,
    
  },

  onCancelImgTap: function (event) {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {}
    }
    )
  },

  onBindFocus: function (event) {
    this.setData({
      // containerShow: false,
      searchPanelShow: true
    })

  },
  onbindblur: function (event) {
    this.setData({
      // containerShow: false,
      searchPanelShow: false
    })

  },
 
  onBindConfirm: function (e) {
     
      // debugger;
    var inputVal = e.detail.value;
    var searchRecord = this.data.searchRecord
    if (inputVal == '') {
      //输入为空时的处理
    }
    else {
      //将搜索值放入历史记录中,只能放前五条
      if (searchRecord.length < 5) {
        searchRecord.unshift(
          {
            value: inputVal,
            id: searchRecord.length
          }
        )
      }
      else {
        searchRecord.pop()//删掉旧的时间最早的第一条
        searchRecord.unshift(
          {
            value: inputVal,
            id: searchRecord.length
          }
        )
      }
      //将历史记录数组整体储存到缓存中
      wx.setStorageSync('searchRecord', searchRecord)
    }

  
    //直接查询 发起请求
    wx.navigateTo({
      url: "search_result/search_result?inputVal=" + inputVal
    });
  },
  openHistorySearch: function () {
    this.setData({
      searchRecord: wx.getStorageSync('searchRecord') || [],//若无储存则为空
    })
  },
  historyDelFn: function () {
    wx.clearStorageSync('searhRecord')
    this.setData({
      searchRecord: []
    })
  },
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    this.openHistorySearch()
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {
    this.setData({
      inputShowed: true
    })
  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    this.openHistorySearch()
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
  onShareAppMessage: function () {

  }
})