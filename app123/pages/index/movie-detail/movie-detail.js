// pages/personal_center/personal_center.js
const app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    xinagqingyeData: {},
    item: '',
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
  gotoCart: function (event) {
    wx.switchTab({
      url: "../../cart/cart"
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
    
    var me = this;
    me.setData({
      item: id
    });
    wx.request({
      url: "http://rap2api.taobao.org/app/mock/167390/index/detail/?+id=${id}", //详情页数据
      header: {
        'content-type': 'application/json'
      },
      success(res) {
        if (res.data.code === 0) {
          // console.log(res.data)
          me.setData({
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
    var itemId = me.data.item;
   
    me.cartItemIncrease(itemId);
  },
  // 商品放入购物车
  cartItemIncrease(itemId) {
    var me = this;

    // 获取购物车的缓存数组（没有数据，则赋予一个空数组）  
    var cartItemIdArray = wx.getStorageSync('cartItemIdArray') || [];  

  

    // 定义标识用于判断购物车缓存中是否含有当前页的商品
    var isItemAdded = false;
    for (var i = 0; i < cartItemIdArray.length; i++) {
      var item = cartItemIdArray[i];
      if (item != null && item != undefined && item.itemId == itemId) {
        // 删除原来的item
        cartItemIdArray.splice(i, 1);
        // 商品counts累加1
        var counts = item.counts + 1;
        // 重新构建商品对象
        var cartItemNew = app.cartItem(itemId, counts);
        cartItemIdArray.push(cartItemNew);
        isItemAdded = true;
        break;
      }
    }

    // 在没有添加过当前商品的时候，新创建一个对象放入数组
    if (!isItemAdded) {
      // 构建新的商品对象
      var cartItem = app.cartItem(itemId, 1);
      // 把这个商品对象放入购物车
      cartItemIdArray.push(cartItem);
    }

    // 把cartItemIdArray存入缓存
   
    wx.setStorage({
      key: 'cartItemIdArray', // 缓存数据的key
      data: cartItemIdArray // 要缓存的数据
    });
    
    var cartItemIdArray = wx.getStorageSync('cartItemIdArray')
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