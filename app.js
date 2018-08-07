//app.js
App({
  globalData: {
    userInfo: null,
    mini_user_id: '',
    mini_user_phoneNumber: '',
    // http_address: "http://127.0.0.1:8088",
    http_address: "https://www.linkgooo.com/householdapi/",

    temporaryLogin: function (encryptedData, iv) {
      wx.hideLoading();
      wx.login({
        success: function (res) {
          if (res.code) {
            wx.request({
              url: getApp().globalData.http_address + '/wechatMini/wechatLogin',
              data: {
                // id: getApp().globalData.mini_user_id,
                encryptedData: encryptedData,
                iv: iv,
                js_code: res.code
              },

              header: {
                'content-type': 'application/json'
              },
              method: 'POST',
              success: function (rs) {
                if (rs.data.success != '200') {
                  wx.showModal({
                    title: '提示',
                    showCancel: false,
                    content: rs.data.message
                  })
                  return false
                }
                // wx.navigateBack({
                //   delta:-1
                // })
                wx.navigateTo({
                  url: '/pages/77_index/index',
                })
           
              }
            })
          }
        }
      })
    }
  },
  onLaunch: function () {

  }

})