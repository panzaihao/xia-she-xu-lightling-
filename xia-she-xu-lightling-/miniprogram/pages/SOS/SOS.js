const app = getApp()


Page({
  data: {
    contents: "",
    Nameone:'',
    Nametwo:'',
    Namethree:'',
    Namefour:'',
    Namefive:'',
    numberone:'',
    numbertwo: '',
    numberthree: '',
    numberfour: '',
    numberfive: '',
  },
  onLoad: function () {
    if (!wx.cloud) {
      console.error('请使用 2.2.3 或以上的基础库以使用云能力')
    } else {
      wx.cloud.init({
        traceUser: true,
      })
    }

    var _this = this;
    wx.cloud.callFunction({
      // 云函数名称
      name: 'number',
      // 传给云函数的参数
      data: {
        tag:1
      },
      success: function (res) {
        console.log(res.result)
        _this.setData({
          contents: res.result.data[0].content,
          Nameone:res.result.data[0].nameone,
          Nametwo: res.result.data[0].nametwo,
          Namethree: res.result.data[0].namethree,
          Namefour: res.result.data[0].namefour,
          Namefive: res.result.data[0].namefive,
          numberone: res.result.data[0].numberone,
          numbertwo: res.result.data[0].numbertwo,
          numberthree: res.result.data[0].numberthree,
          numberfour: res.result.data[0].numberfour,
          numberfive: res.result.data[0].numberfive,
        })
      },
      fail: console.error
    })
  },
   one: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.numberone,
      nameone: this.data.nameone,
    })
  },
  two: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.numbertwo,
      nametwo: this.data.nametwo,
    })
  },
  three: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.numberthree,
      namethree: this.data.namethree,
    })
  },
  four: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.numberfour,
      namefour: this.data.namefour,
    })
  },
  five: function () {
    wx.makePhoneCall({
      phoneNumber: this.data.numberfive,
      namefive: this.data.namefive,
    })
  },
  110: function () {
    wx.makePhoneCall({
      phoneNumber: '110',
    })
  },
  119: function () {
    wx.makePhoneCall({
      phoneNumber: '119',
    })
  },
  120: function () {
    wx.makePhoneCall({
      phoneNumber: '120',
    })
  }
})
