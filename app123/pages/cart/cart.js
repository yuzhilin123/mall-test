const app = getApp();

Page({
  data: {
   
    emptyHidden: false,
    fullHidden: true,

    // 不可变商品列表，用于结算
    finalCartItemList: [],

    customUnSelectImg: "unselect",
    customSelectImg: "select",

    // 定义全选状态
    allSelectImg: "unselect",
    defaultSelectedAll: false,

    // 默认的合计金额
    totalAmount: 0,
    // 默认的结算件数
    cartItemNum: 0,

  
    preOrderItemList: [],
    
    num: 1,
    
    minusStatus: 'disabled'

  },



  // 跳转到首页
  helpYourself(e) {
    wx.switchTab({
      url: "../../pages/index/index"
    })
  },

  // radioChange(e) {
  //   console.log('radio发生change事件，携带value值为：', e.detail.value)
  // },
 
  // 每次页面显示，请求最新的商品数据
  onShow() {
    var me = this;

    // 初始化数据
    me.setData({
      emptyHidden:true,
      fullHidden: false,

      allSelectImg: "unselect",
      defaultSelectedAll: false,

      // 默认的合计金额
      totalAmount: 0,
      // 默认的结算件数
      cartItemNum: 0,
    });

    // 从缓存中拿到购物车数组对象

    var cartItemIdArray = wx.getStorageSync('cartItemIdArray');
 
    // 判断cartItemIdArray是否为空，如果不为空，则到后台接口查询商品数据
    if (cartItemIdArray != null && cartItemIdArray != undefined) {
      me.setData({
        emptyHidden: true,
        fullHidden: false, 
      });

      // 循环拼接商品ids   1001,1002,1003,
      var itemIds = "";
      for (var i = 0; i < cartItemIdArray.length; i++) {
        var tempId = cartItemIdArray[i].itemId;
        itemIds += tempId + ",";
      }

      // 发送请求到后端
      wx.showNavigationBarLoading();
      wx.showLoading({
        content: "加载中..."
      });

      // 请求接口，查询商品详情
      wx.request({
        url: app.serverUrl + '/item/queryItems?itemIds=' + itemIds,
        
        method: 'POST',
        header: {
          'content-type': 'application/json'
        },
        dataType: 'json',
        success: function(res) {
         
          // 获取拿到后端的数据
          var myData = res.data;
          if (myData.status == 200) {
            var itemList = myData.data;
            // console.log(itemList);

            var finalCartItemList = [];
            for (var i = 0; i < itemList.length; i++) {
              var itemId = itemList[i].id;
              // 根据itemId从缓存购物车中获取商品的件数
              var itemCounts = app.fetchItemCounts(cartItemIdArray, itemId);
              var isSelect = 0; // 默认未选中：0   选中：1
              // 构建全局不可变商品
              var finalCartItem = app.finalCartItem(itemList[i], itemCounts, isSelect);
             
              // 不可变商品列表，用于结算
              finalCartItemList.push(finalCartItem);
          
            }
            me.setData({
              finalCartItemList: finalCartItemList,
            });
          }
        },
        complete: function(res) {
          wx.hideNavigationBarLoading();
          wx.hideLoading();
        }
      });
    }
   
  
  
  
  },
  

  // 用户单机触发的checkbox事件
  touchItem(e) {
    var me = this;
    // 获取商品信息dataset
    var itemInfo = e.target.dataset.iteminfo;
 
    var singleArray = itemInfo.split(","); 
    var itemId = singleArray[0];
    var counts = singleArray[1];
 
    // 获取checkbox之前的状态
    var finalCartItemList = me.data.finalCartItemList;
    var isSelect = app.fetchItemIsSelect(finalCartItemList, itemId);

    // 把状态反转一下，然后重新构建新的商品后放入购物车list
    if (isSelect == 1) {
      isSelect = 0;
    } else {
      isSelect = 1;
    }

    var finalItem = app.fetchItemFromFinalList(finalCartItemList, itemId);
    var newFinalItem = app.finalCartItem(finalItem, counts, isSelect);

    // 移除finalCartItemList中原来的商品，把心的商品放入
    for (var i = 0; i < finalCartItemList.length; i++) {
      var tempItemId = finalCartItemList[i].item.id;
      if (tempItemId == itemId) {
        finalCartItemList.splice(i, 1, newFinalItem);
        break;
      }
    }

    // 重新进行数据绑定
    me.setData({
      finalCartItemList: finalCartItemList
    });

    me.reCalCartAmount(finalCartItemList);
  },

  // 全选或取消全选
  checkAllBox() {
    var me = this;

    // 获取全选状态
    var defaultSelectedAll = me.data.defaultSelectedAll;

    // 根据全选状态去判断，如果是true，代表所有的框都选中，false代表全部没选中
    var isSelect = 0;
    var allSelectImg = "unselect";
    if (defaultSelectedAll) {
      isSelect = 0;
      allSelectImg = "unselect";
    } else {
      isSelect = 1;
      allSelectImg = "select";
    }

    // 重新进行数据绑定
    me.setData({
      allSelectImg: allSelectImg,
      defaultSelectedAll: !defaultSelectedAll,
    });

    // 重新定义购物车中的list，重构以及渲染
    var finalCartItemList = me.data.finalCartItemList;
    var newFinalCartItemList = [];
    for (var i = 0; i < finalCartItemList.length; i++) {
      var item = finalCartItemList[i].item;
      var counts = finalCartItemList[i].counts;
      var newFinalItem = app.finalCartItem(item, counts, isSelect);
      newFinalCartItemList.push(newFinalItem);
    }

    me.setData({
      finalCartItemList: newFinalCartItemList
    });

    me.reCalCartAmount(newFinalCartItemList);
  },

  // 计算商品金额以及商品件数
  reCalCartAmount(finalCartItemList) {
    var me = this;

    var totalAmount = 0;
    var cartItemNum = 0;
    // 定义预处理订单数据列表
    var preOrderItemList = [];
    for (var i = 0; i < finalCartItemList.length; i++) {
      var tempIsSelect = finalCartItemList[i].isSelect;
      if (tempIsSelect == 1) {
        // 只有选中的商品，才会去计算
        var itemCounts = finalCartItemList[i].counts;
        var itemAmount = finalCartItemList[i].item.priceDiscountYuan * itemCounts;
        totalAmount += itemAmount;
        cartItemNum++;
        // cartItemNum += itemCounts;

        // 构建预处理订单商品对象
        var preOrderItem = app.finalCartItem(finalCartItemList[i].item, itemCounts, null);
        preOrderItemList.push(preOrderItem);
      }
    }

    // 重新赋值到页面去渲染
    me.setData({
      totalAmount: totalAmount,
      cartItemNum: cartItemNum,
      preOrderItemList: preOrderItemList,
    });
  },
  /* 点击减号 */
  bindMinus: function (res) {
   
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
  bindPlus: function (res) {
    console.log(res)
    debugger
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
  //平台自营
  checkCo(){
    var me = this;
    me.setData({

    })
  },
  // 用户前往结算页面确认订单进行支付
  goConfirm() {
    var me = this;

    var totalAmount = me.data.totalAmount;
    if (totalAmount <= 0) {
      wx.alert({
        title: '温馨提示',
        content: "请至少选择一项商品再去结算",
        buttonText: "知道了！",
      });
    } else {
      // 把预处理订单数据列表存入缓存，在结算页面获取后进行处理
      wx.setStorage({
        key: 'preOrderItemList', // 缓存数据的key
        data: me.data.preOrderItemList, // 要缓存的数据
      });

    //   // TODO: 购买商品之前需要判断当前用户是否登录
      wx.navigateTo({
        url: "cart_confirm/cart_confirm"
      });
    }
  },
 
});