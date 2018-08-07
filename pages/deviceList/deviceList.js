// pages/deviceList/deviceList.js
var app = getApp()

var interval;
var varName;
var ctx = wx.createCanvasContext('canvasArcCir')
Page({

  /**
   * 页面的初始数据
   */
  data: {
    list: [],
    showView: false,
    checkStatus: false,
    deviceShow: false,
    deviceNum: '',
    deviceId: '',
    deviceUserName: '',
    bindUserList: {},
    index: '',
    deviceIndex: '',
    userNum: '',
    sendShow: false,
    userId: '',
    check: '',
    checkSendPwdData: null,
    pwds: null,
    pwdCode: null,
    pwdTimes: []
  },


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {

  },
  /**
   * 绑定设备
   */
  bindDevice: function () {
    wx.navigateTo({
      url: '../bindDevice/bindDevice',
    })
  },
  /**
   * 选择设备
   */
  checkStatus: function (e) {
    var that = this
    var check = that.data.checkStatus
    var list = that.data.list
    var index = e.currentTarget.dataset.index
    var this_checkSendPwdData = null;
    var send_but_show_bool = false;
    for (var i = 0; i < list.length; i++) {
      if (i == index) {
        if (list[i].check == true) {
          list[i].check = false;
        } else {
          list[i].check = true
          this_checkSendPwdData = list[i];
          send_but_show_bool = true
        }

      } else {
        list[i].check = false
      }
    }
    that.setData({
      list: list,
      checkStatus: send_but_show_bool
    })
    if (this_checkSendPwdData) {
      that.setData({
        checkSendPwdData: this_checkSendPwdData
      })
    }
  },
  /**
   * 显示设备详情
   */
  deviceShow: function (e) {
    var that = this
    var shows = that.data.deviceShow
    var device_Index = that.data.deviceIndex
    var list = that.data.list
    var index = e.currentTarget.dataset.index
    var deviceId = list[index].devicePlatformPkcode
    for (var i = 0; i < list.length; i++) {
      if (i == index) {
        if (list[i].shows == true) {
          list[i].shows = false;
        } else {
          list[i].shows = true

        }

      } else {
        list[i].shows = false
      }
    }
    wx.request({
      url: getApp().globalData.http_address + "/wechatMini/deviceBindUserList",
      data: {
        device_id: deviceId
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data.data;
        var list = that.data.list;
        list[index].clist = result
        that.setData({
          bindUserList: result,
          userNum: result.length,
          list: list
        })
      }
    })
  },

  /**
   * 申请解绑
   */
  unbindDevice: function (e) {
    var that = this
    var index = that.data.checkSendPwdData
    var list = that.data.list
    var checkSendPwdData = that.data.checkSendPwdData
    var deviceBindPkcode = checkSendPwdData.deviceBindPkcode
    wx.showModal({
      title: '温馨提示',
      content: '是否解绑该设备',
      success: function (rs) {
        list.splice(index, 1)
        if (rs.confirm) {
          wx.request({
            url: getApp().globalData.http_address + "/wechatMini/removeBind",
            data: {
              bindid: deviceBindPkcode
            },
            method: "POST",
            header: {
              'content-type': 'application/json' // 默认值
            },
            success: function (res) {

              wx.showToast({
                title: '解绑成功',
                icon: 'success',
                duration: 1000
              })
              that.getList()
            }
          })
        } else if (rs.cancel) {

        }
      }
    })

  },

  /**
   * 关闭弹窗
   */
  closeModal: function () {
    this.setData({
      sendShow: false
    })
    this.randomCode()
    this.randomPwd()
    this.getList()
  },

  /**
   * 发送密码
   */

  sendPwd: function (e) {
    this.randomCode()
    this.randomPwd()
    var that = this
    var currentStatu = e.currentTarget.dataset.statu
    that.util(currentStatu)

  },
  util: function (currentStatu) {
    /* 动画部分 */
    // 第1步：创建动画实例 
    var animation = wx.createAnimation({
      duration: 200, //动画时长 
      timingFunction: "linear", //线性 
      delay: 0 //0则不延迟 
    });

    // 第2步：这个动画实例赋给当前的动画实例 
    this.animation = animation;

    // 第3步：执行第一组动画 
    animation.opacity(0).rotateX(-100).step();

    // 第4步：导出动画对象赋给数据对象储存 
    this.setData({
      animationData: animation.export()
    })

    // 第5步：设置定时器到指定时候后，执行第二组动画 
    setTimeout(function () {
      // 执行第二组动画 
      animation.opacity(1).rotateX(0).step();
      // 给数据对象储存的第一组动画，更替为执行完第二组动画的动画对象 
      this.setData({
        animationData: animation
      })

      //关闭 
      if (currentStatu == "close") {
        this.setData(
          {
            sendShow: false
          }
        );
      } else if (currentStatu == 'hidden') {
        this.setData({
          sendShow: false
        })
      }
    }.bind(this), 200)

    // 显示 
    if (currentStatu == "open") {
      this.setData(
        {
          sendShow: true,

        }
      )
    }
  },

  /**
   * 确认密码
   */

  devicePwd: function (e) {
    var that = this
    var userId = that.data.userId
    var checkSendPwdData = that.data.checkSendPwdData;
    var deviceBindPkcode = checkSendPwdData.devicePlatformPkcode
    var pwd = e.detail.value.pwd
    var pwdId = e.detail.value.pwdId
    var times = e.detail.value.times
    wx.request({
      url: getApp().globalData.http_address + "/wechatMini/newSendPwd",
      data: {
        id: userId,
        device_id: deviceBindPkcode,
        pwd: pwd,
        type: '1',
        pwd_id: pwdId,
        time: times
      },
      method: 'POST',
      header: {
        'content-type': 'application/json' // 默认值
      },
      success: function (res) {
        var result = res.data.data
        if (res.data.success == '200') {
          wx.showToast({
            title: '发送成功',
            icon: 'success',
            duration: 1000
          })
          that.getList()
          that.setData({
            sendShow: false
          })
        }
        else {
          wx.showToast({
            title: '发送失败',
            icon: 'message',
            duration: 1000
          })
        }
      }
    })
  },
  /**
   * 申请开锁
   */
  openLock: function () {
    var that = this
    var checkSendPwdData = that.data.checkSendPwdData
    var deviceBindPkcode = checkSendPwdData.devicePlatformPkcode
    var user = wx.getStorageSync("userInfo");
    wx.request({
      url: getApp().globalData.http_address + "/wechatMini/nowOpen",
      method: "POST",
      header: {
        'content-type': 'application/json' // 默认值
      },
      data: {
        id: user.id,
        mobile: user.mobile,
        device_id: deviceBindPkcode
      },
      success: function (res) {
        if (res.data.success == "200") {
          wx.showToast({
            title: '开锁成功',
            icon: 'success',
            duration: 1000
          })
          // that.setData({
          //   showView: true,
          // })
        } else {
          wx.showToast({
            title: '开锁失败',
            icon: 'none',
            duration: 1000
          })
        }
      }
    })
  },
  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function () {

  },
  randomPwd: function () {
    var Num = ""
    for (var i = 0; i < 6; i++) {
      Num += Math.floor(Math.random() * 10)
      this.setData({
        pwds: Num
      })
    }
  },
  randomCode: function () {
    var pwdCode = ''
    pwdCode = Math.floor(Math.random() * 199 + 1)
    this.setData({
      pwdCode: pwdCode
    })
  },
  getList: function () {
    var that = this;
    var user = wx.getStorageSync("userInfo")
    var id = user.id
    var deviceIndex = that.data.index
    var indexs = deviceIndex + 1
    that.setData({
      userId: id
    })
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
            var list = res.data.data

            for (var i = 0; i < list.length; i++) {

              list[i].check = false
              if (list[i].deviceBindPwd != '' && list[i].deviceBindPwdState == '0') {
                list[i].devicePwd = false

              } else if (list[i].deviceBindPwd != '' && list[i].deviceBindPwdState == '1') {
                list[i].devicePwd = true
              }
            }
            that.setData({
              list: list,
              deviceNum: res.data.data.length,
              showView: false
            })
          } else {
            that.setData({
              showView: true,
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
    var that = this;
    that.setData({
      checkSendPwdData: null
    })
    // this.devicePwd()
    that.randomCode()
    that.randomPwd()
    that.setData({
      checkSendPwdData: null
    })

    that.getList()

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

  }
})

