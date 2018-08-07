// pages/77_index/index.js
var app = getApp().globalData
Page({

  /**
   * 页面的初始数据
   */
  data: {
    lockBtn: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

    
  },
  /**
 * 生命周期函数--监听页面初次渲染完成
 */
  onReady: function () {
    
  },

  /**
   * 获取设备列表
  //  */
  deviceLists: function () {
    var that = this;
    var user = getApp().globalData.userInfo
    var _user = wx.getStorageSync("userInfo")
    var id = null
    if (user){
      id = user.id
    }else{
      id = _user.id
    }

    wx.request({
      url: getApp().globalData.http_address + "/wechatMini/deviceList",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: { id: id },
      success: function (res) {
        if (res.data.success == "200") {
          if (res.data.data && res.data.data.length > 0) {
            that.setData({
              lockBtn:true
            })
          } else {
            that.setData({
              lockBtn: false
            })
          }
        }
      }
    })
  },



  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function () {
    login()
    var that = this
    var u = wx.getStorageSync("userInfo");
    if (u != null && u != undefined && u != '') {
      that.deviceLists()
      return false;
    }

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
  open: function () {
    var that=this
    var user = wx.getStorageSync("userInfo");
    wx.request({
      url: getApp().globalData.http_address + "/wechatMini/nowOpen",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: { id: user.id, mobile: user.mobile },
      success: function (res) {
        if (res.data.success == "200") {
          wx.showToast({
            title: '开锁成功',
            icon: 'success',
            duration: 1000
          })
          that.setData({
            showView: true,
          })
        }else{
          wx.showToast({
            title: '开锁失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  bindDevice: function () {
    wx.navigateTo({
      url: "/pages/bindDevice/bindDevice"
    })
  },
  deviceList: function () {
    wx.navigateTo({
      url: "/pages/deviceList/deviceList"
    })
  },
  logs: function () {
    wx.navigateTo({
      url: "/pages/logs/logs"
    })
  }

})
function login() {
  wx.login({
    success: function (res) {
      if (res.code) {
        wx.request({
          url: app.http_address + '/wechatMini/tempLogin',
          data: {
            js_code: res.code
          },
          method: "POST",
          success: function (rs) {
            if(rs.data.success=='200'){
              let loginData = wx.getStorageSync('userInfo') || {}
              let login = rs.data.data
              wx.setStorageSync('userInfo', login)
              var Mobile = rs.data.data.mobile
              app.userInfo = login
            }
            if (Mobile) {   //判断是否存在手机号，否则跳转授权微信页面
              app.mini_user_phoneNumber = Mobile
            } else {
              // wx.navigateTo({
              //   url: '../wechatLogin/wechatLogin'
              // })
              
              wx.redirectTo({
                url: '../wechatLogin/wechatLogin',
              })
            }
          },
          fail:function(e){
            wx.showToast({
              title: "fail",
              icon: 'success',
              duration: 1000,
              mask: true
            })
          }
        })
      } else {
        console.log('登录失败！' + res.errMsg)
      }
    }
  })
}