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
    animationOpacity: 0,
    showShopPopup:false,
    showSuccess:false,
    animationData: {}, // 动画数据
    // input默认是1
    num: 1,
    // 使用data数据对象设置样式名
    minusStatus: 'disabled'
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
      url: app.serverUrl + '/item/queryItems?itemIds=' + me.data.item, //详情页数据
      header: {
        'content-type': 'application/json'
      },
      method: 'POST',
      success(res) {
        if (res.data.status === 200) {
          console.log(res.data)
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
  dialog_confirm() {
    
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
    this.setData({
      showSuccess:true,
      showShopPopup: false
    })
    this.hideModal()
    
    
    var cartItemIdArray = wx.getStorageSync('cartItemIdArray')
    setTimeout(function () {
      this.setData({
        
        showSuccess:false,
      });

     
    }.bind(this), 1000);
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



  buyMe(){
    this.showModal();
  },
  addToCart(){
    this.showModal();
  },
  /**
   * 生命周期函数--监听页面隐藏
   */    bindMinus: function () {
    var num = this.data.num;
    // 如果大于1时，才可以减
    if (num > 1) {
      num--;
    }
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num <= 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 点击加号 */
  bindPlus: function () {
    var num = this.data.num;
    // 不作过多考虑自增1
    num++;
    // 只有大于一件的时候，才能normal状态，否则disable状态
    var minusStatus = num < 1 ? 'disabled' : 'normal';
    // 将数值与状态写回
    this.setData({
      num: num,
      minusStatus: minusStatus
    });
  },
  /* 输入框事件 */
  bindManual: function (e) {
    var num = e.detail.value;
    // 将数值与状态写回
    this.setData({
      num: num
    });
  },

  onHide: function() {

  },
  showModal() {
    // 显示遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      /**
        * http://cubic-bezier.com/ 
        * linear 动画一直较为均匀
        * ease 从匀速到加速在到匀速
        * ease-in 缓慢到匀速
        * ease-in-out 从缓慢到匀速再到缓慢
        * 
        * http://www.tuicool.com/articles/neqMVr
        * step-start 动画一开始就跳到 100% 直到动画持续时间结束 一闪而过
        * step-end 保持 0% 的样式直到动画持续时间结束 一闪而过
        */
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(), // export 方法每次调用后会清掉之前的动画操作。
      showShopPopup: true
    })
    setTimeout(() => {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export()  // export 方法每次调用后会清掉之前的动画操作。
      })
      // console.log(this)
    }, 200)
  },
  hideModal() {
    // 隐藏遮罩层
    var animation = wx.createAnimation({
      duration: 200,
      timingFunction: "ease",
      delay: 0
    })
    this.animation = animation
    animation.translateY(300).step()
    this.setData({
      animationData: animation.export(),
    })
    setTimeout(function () {
      animation.translateY(0).step()
      this.setData({
        animationData: animation.export(),
        showShopPopup: false
      })
      // console.log(this)
    }.bind(this), 200)
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