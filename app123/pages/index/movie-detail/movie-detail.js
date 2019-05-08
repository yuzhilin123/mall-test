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
    animationOpacity: 0
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

  // 添加商品到购物车
  addToCart() {
   var me=this;
    
    me.setData({
      animationOpacity: 1
    })

    me.showAddToCartAnimation();


    // 商品id存入缓存购物车
    // var itemId = me.data.item.id;
    // me.cartItemIncrease(itemId);
  },
  // 实现动画效果
  showAddToCartAnimation() {
    // 创建动画
    var animation = wx.createAnimation({
      duration: 500
    });
    this.animation = animation;

    // rotate: 旋转
    // this.animation.rotate(-180).step();
    // translateX 在水平轴上移动
    // this.animation.translateX("296rpx").step();
    // 旋转的同时，又在水平轴上移动
    this.animation.rotate(-180).translateX("128px").step();

    this.setData({
      // 导出动画效果到页面
      animationInfo: this.animation.export()
    });

    // 复原动画
    setTimeout(function () {
      this.setData({
        animationOpacity: 0,
        cartIco: "cart-full",
      });

      setTimeout(function () {
        this.animation.rotate(0).translateX(0).step({
          duration: 0
        });
        this.setData({
          animationInfo: this.animation.export()
        });
      }.bind(this), 550);
    }.bind(this), 600);

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