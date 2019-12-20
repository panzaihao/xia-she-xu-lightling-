// miniprogram/pages/index/index.js
var QQMapWX = require('qqmap-wx-jssdk.js');
var qqmapsdk;
Page({

  data: {
    latitude:'',
    longitude: '',
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    var that=this,
      // 实例化API核心类
      qqmapsdk = new QQMapWX({
        key: 'I62BZ-JML6U-6RJVI-4KRRO-7ZJPQ-2CBPT'
      });
    wx.getLocation({
      type: 'wgs84',
      isHighAccuracy:'ture',
      success(res) {
        console.log(res)
        that.setData({
        latitude : res.latitude,
        longitude :res.longitude,
        speed :res.speed,
        accuracy: res.accuracy
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
  daohang: function () {
    let plugin = requirePlugin('routePlan');
    let key = 'I62BZ-JML6U-6RJVI-4KRRO-7ZJPQ-2CBPT';  //使用在腾讯位置服务申请的key
    let referer = '微信';   //调用插件的app的名称
    let endPoint = JSON.stringify({  //终点
      'name': '',
      'latitude': 39.89631551,
      'longitude': 116.323459711
    });
    wx.navigateTo({
      url: 'plugin://routePlan/index?key=' + key + '&referer=' + referer + '&endPoint=' + endPoint
    });
    wx.navigateBack({
      url:'../../index'
    })
  },
 
  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {

  }
})