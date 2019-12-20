// pages/databaseGuide/databaseGuide.js

const app = getApp()

Page({

  data: {
    step: 1,
    counterId: '',
    openid: '',
    count: null,
    queryResult: '',
    inputValue1:'',
    inputValue2: '',
    inputValue3: '',
    inputValue4: '',
  },
  nextStep: function () {
    
    if (this.data.step === 1 && !this.data.openid) {
      wx.cloud.callFunction({
        name: 'login',
        data: {},
        success: res => {
          app.globalData.openid = res.result.openid
          this.setData({
            step: 2,
            openid: res.result.openid
          })
        },
        fail: err => {
          wx.showToast({
            icon: 'none',
            title: '获取 openid 失败，请检查是否有部署 login 云函数',
          })
          console.log('[云函数] [login] 获取 openid 失败，请检查是否有部署云函数，错误信息：', err)
        }
      })
    } else {
      const callback = this.data.step !== 6 ? function () { } : function () {
        console.group('数据库文档')
        console.log('https://developers.weixin.qq.com/miniprogram/dev/wxcloud/guide/database.html')
        console.groupEnd()
      }

      this.setData({
        step: this.data.step + 1
      }, callback)
    }
  },

  prevStep: function () {
    this.setData({
      step: this.data.step - 1
    })
  },
 
input1:function(e){
 var value=e.detail.value
 this.setData({
   inputValue1:value
 })
},
input2: function (e) {
  var value = e.detail.value
  this.setData({
    inputValue2: value
  })
},

input3: function (e) {
  var value = e.detail.value
  this.setData({
    inputValue3: value
  })
},
input4: function (e) {
  var value = e.detail.value
  this.setData({
    inputValue4: value
  })
},
upload:function(){
  var input1= this.data.inputValue1;
  var input2 = this.data.inputValue2;
  var input3 = this.data.inputValue3;
  var input4 = this.data.inputValue4;

  var db=wx.cloud.database()
  db.collection("lianxiren").add({
    data:{
      input1: this.data.inputValue1,
      input2: this.data.inputValue2,
      input3: this.data.inputValue3,
      input4: this.data.inputValue4,
    }
  })
},
  goHome:function()
  {
    wx.switchTab({
      url: '/tianqi'
    })
  }
})
 

