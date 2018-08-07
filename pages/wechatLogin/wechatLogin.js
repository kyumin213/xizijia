// pages/wechatLogin/wechatLogin.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
  
  },
  getPhoneNumber: function (e) {
    if (e.detail.encryptedData) {
      wx.showLoading({
        title: '发送中，请稍后',
      })
      getApp().globalData.temporaryLogin(e.detail.encryptedData, e.detail.iv)
    } else {
      wx.showModal({
        title: '提示',
        showCancel: false,
        content: '您拒绝了授权微信绑定手机号，允许授权后将为您自动登陆',
      })
    }
  },
  // getPhoneNumber: function (e) {
  //   var iv = e.detail.iv;
  //   var encryptedData = e.detail.encryptedData;
  //   wx.login({
  //     success: res => {
  //       if (res.code) {
  //         wx.request({
  //           url: getApp().globalData.http_address + "/wechatMini/wechatLogin",
  //           method: "POST",
  //           header: {
  //             'content-type': 'application/json' // 默认值
  //           },
  //           data: { js_code: res.code, iv: iv, encryptedData: encryptedData },
  //           success: function (res) {
  //             if (res.data.success == "200") {
  //               getApp().globalData.userInfo = res.data.data;
  //               wx.setStorageSync("userInfo", res.data.data);
  //               wx.navigateBack({
  //                 delta: -1
  //               });
  //             } else {
  //             }

  //           }
  //         })
  //       }
  //     }
  //   })
  // }

  

  
  

 
 
})