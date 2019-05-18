const app = getApp();

Page({
  data: {


    addressEmpty: false,
    addressFull: true,
  },
  onLoad() {
    // var me = this;
    // me.initAddress();
   },

  initAddress() {
    var me = this;

    // 获取全局的用户对象
    var userInfo = app.globalData.userInfo;
    // 使用临时id 1001
    var userId = 1001;
    if (userInfo != null && userInfo != undefined) {
      userId = userInfo.id;
    }


    // 首先应该到缓存里去查询是否存在地址缓存信息，减少后端的交互
    var addressChoosed = wx.getStorageSync( 'addressChoosed' );
    if (addressChoosed != null && addressChoosed != undefined) {
      me.setData({
        addressEmpty: true,
        addressFull: false,

        addressInfo: addressChoosed,
      });
      return;
    }


    // 发送请求到后端
    wx.showNavigationBarLoading();
    wx.showLoading({
      content: "疯狂加载中..."
    });

    // 请求接口
    wx.request({
      url: app.serverUrl + '/address/default/' + userId,
      method: 'POST',
      header: {
        'content-type': 'application/json'
      },
      dataType: 'json',
      success: function (res) {
        console.log(res);
        // 获取拿到后端的数据
        var myData = res.data;
        console.log("========== 查询地址信息 start ===========");
        console.log(myData);
        console.log("========== 查询地址信息 end ===========");
        if (myData.status == 200) {
          // 获得地址
          var address = myData.data;
          if (address == null || address == undefined) {
            wx.setData({
              addressEmpty: false,
              addressFull: true,
            });
          } else {
            wx.setData({
              addressEmpty: true,
              addressFull: false,

              addressInfo: address,
            });
          }

        }
      },
      complete: function (res) {
        wx.hideNavigationBarLoading();
        wx.hideLoading();
      }
    });
  },

 
});
