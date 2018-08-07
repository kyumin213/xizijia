//logs.js
Page({
  data: {
    logs: []
  },
  onLoad: function () {
    var that = this;
    var user = wx.getStorageSync('userInfo')
    var id = user.id

    wx.request({
      url: getApp().globalData.http_address + "/wechatMini/deviceLogs",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: { id: id },
      success: function (res) {
        if (res.data.success == "200") {
          if (!res.data.data || res.data.data.length == 0) {
            that.setData({
              showView: true
            })
          }else{
            that.setData({
              logs: res.data.data
            })
          }
        }
      }
    })
  }
})
