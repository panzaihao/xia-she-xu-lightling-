Page({

  /**
   * 页面的初始数据
   */
  data: {
    
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.loadInfo()
    wx.getSetting({
      success: res => {
        if (res.authSetting['scope.userInfo']) {
          // 已经授权，可以直接调用 getUserInfo 获取头像昵称，不会弹框
          wx.getUserInfo({
            success: res => {
              this.setData({
                avatarUrl: res.userInfo.avatarUrl,
                user: res.userInfo
              })
              console.log(this.data.user)
            }
          })
        }
      }
    })
  },
  onGetUserInfo: function (e) {
    if (!this.data.logged && e.detail.userInfo) {
      this.setData({
        logged: true,
        avatarUrl: e.detail.userInfo.avatarUrl,
        user: e.detail.userInfo
      })
    }
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
loadInfo:function(){
  var  page=this;
  wx.getLocation({
    type: 'gcj02', //返回可以用于wx.openLocation的经纬度
    success(res) {
      var latitude = res.latitude
     var longitude = res.longitude
      console.log(latitude, longitude);
      page.loadCity(latitude, longitude);
    }
  })

},
  loadCity: function (latitude,longitude){
    var page=this;
    wx.request({
      url: 'http://api.map.baidu.com/reverse_geocoding/v3/?ak=Y4z2o9m5dgvK4hnl5PPjKx91KvVuaMse&output=json&coordtype=wgs84ll&location=' + latitude + ','+longitude+'&output=json',//仅为示例，并非真实的接口地址
      
      header: {
        'content-type': 'application/json' // 默认值
      },
      success:function(res) {
        console.log(res);
        var city=res.data.result.addressComponent.city;
        var district = res.data.result.addressComponent.district;
        city=city.replace("市","")
         page.setData({city:city});
         page.setData({district:district });
         page.loadWeather(city);
      },
      
    })
},
loadWeather:function(city){
  var page=this;
  wx.request({
    url: 'http://wthrcdn.etouch.cn/weather_mini?city='+city, 
   
    header: {
      'content-type': 'application/json' // 默认值
    },
    success:function(res){
      console.log(res)
      var future=res.data.data.forecast;
      var todayInfo=future.shift();
      var today=res.data.data;
      today.todayInfo = todayInfo;
      page.setData({today:today,future:future, city: city });
    }
  })
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