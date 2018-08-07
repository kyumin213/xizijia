// pages/bindDevice/bindDevice.js
var app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    show: '',
    bindDevice: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 扫一扫
   */
  scCode: function () {
    var that = this
    wx.scanCode({
      success: (res) => {
        this.show = res.result 
        that.setData({
          show: this.show
        })
        wx.showToast({
          title: '成功',
          icon: 'success',
          duration: 2000
        })
      },
      fail: (res) => {
        wx.showToast({
          title: '失败',
          icon: 'success',
          duration: 2000
        })
      },
    })
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

  },
  sub: function (e) {
    var v = e.detail.value
    if(!v){
      wx.showToast({
        title: "v is null",
        icon: 'success',
        duration: 1000,
        mask: true
      })
    }
    var sn = v.sn
    if (!sn) {
      wx.showToast({
        title: "sn is null",
        icon: 'success',
        duration: 1000,
        mask: true
      })
    }
    // var user = app.userInfo
    var user=wx.getStorageSync('userInfo')
    var id = user.id
    var mobile = user.mobile

    wx.request({
      url: app.http_address + "/wechatMini/bindDevice",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: { 
        sn: sn, 
        id: id, 
        mobile: mobile
         },
      success: function (res) {
        if (res.data.success != "200") {
          wx.showToast({
            title: res.data.message,
            icon: 'none',
            duration: 1000,
            mask: true
          })
        } else {
          wx.showToast({
            title: "成功",
            icon: 'success',
            duration: 1000,
            mask: true
          })
          wx.navigateBack({
            delta:1
          })
        }
      },
      fail:function(){
        wx.showToast({
          title: "操作异常",
          icon: 'none',
          duration: 1000,
          mask: true
        })
      }
    })
  }
})