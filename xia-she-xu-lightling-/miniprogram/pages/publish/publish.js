var paths = "";
let touch = 0;
var that=this;
const db = wx.cloud.database();
var AppId = 1300527587;
var SecretId = "AKIDwgBRSEuwBCyUkle1HSO4VhtvkLtDKBoD";
var SecretKey = "IMBQSFn8GEyW2JK5btxpV7TZQ3tXzCKC"
var plugin = requirePlugin("QCloudAIVoice")
plugin.setQCloudSecret(AppId, SecretId, SecretKey) //设置腾讯云账号信息，其中appid是数字，secret是字符串
let manager = plugin.getRecordRecognitionManager()
Page({

  /**
   * 页面的初始数据
   */
  data: {
    paths: "",
    images: [],
    motto:"这里将显示语音识别的结果",
    canIUse: wx.canIUse('button.open-type.getUserInfo'),
    content: '',
    user: {},
    isLike: false,
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
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
  //输入内容
  input: function (e) {
    var value = e.detail.value;
    console.log(e)
    this.setData({
      Value1: value
    })
  },
  getTextAreaContent: function (event) {
    this.data.content = event.detail.value;
  },
  //按下后开始录音
  touchdown: function () {
    const recorderManager = wx.getRecorderManager()
    touch++;
    recorderManager.onStart(() => {
      console.log('recorder start')
      if (touch % 2 != 0) {
        wx.showModal({
          title: '提示',
          content: '点第二遍会停止录音',
          showCancel: 'false',
          success(res) {
            if (res.confirm) {
              console.log('用户点击确定')
            }
          }
        })
        wx.showLoading({
          title: '录音中',
        })
        setTimeout(function () {
          wx.hideLoading()
        }, 5000)
      }
    })
    recorderManager.onPause(() => {
      console.log('recorder pause')
    })
    /*recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath, duration } = res
    })*/
    recorderManager.onFrameRecorded((res) => {
      const { frameBuffer } = res
      console.log('frameBuffer.byteLength', frameBuffer.byteLength)
    })

    const options = {
      duration: 60000,
      sampleRate: 44100,
      numberOfChannels: 1,
      encodeBitRate: 192000,
      format: 'aac',
      frameSize: 50
    }
    recorderManager.start(options)
  },
  //松开后录音结束
  touchup: function () {
    const recorderManager = wx.getRecorderManager()
    recorderManager.stop();
    recorderManager.onStop((res) => {
      console.log('recorder stop', res)
      const { tempFilePath, duration } = res
      this.setData({
        paths: res.tempFilePath,
      })
      console.log(paths)
    })

  },
  video: function () {
    //播放声音文件      
    wx.playVoice({
      filePath: this.data.paths
    })
  },
  /**
   * 语音识别
   */
  // 上传图片至服务器并接受返回的结果
  analyse: function () {
    if (!this.data.paths) {
      console.error("no voice")
      return;
    }
    //frameBuffer
    //语音数据识别
    plugin.sentenceRecognition({
      engSerViceType: '8k',  //引擎类型
      sourceType: 1,  //0：语音 URL
      voiceFormat: 'mp3',
      url: '',
      data: this.data.paths,
      dataLen: 10000,
      projectId: 0,
      success: function (data) {
        console.log('sentenceRecognition succ:', data.result)
        this.setData({
          motto: data.result
        })
      },
      fail: function (err) {
        console.log('sentenceRecognition error:', err)
      }
    })
  },
  /**
   * 选择图片
   */
  
  chooseImage: function (event) { 
    var that=this;
    wx.chooseImage({
      count: 6,
      success: function (res) {
        // 设置图片
        that.setData({
          images: res.tempFilePaths,
        })
        that.data.images = [],
        console.log(res.tempFilePaths)
        for (var i in res.tempFilePaths) {
          // 将图片上传至云存储空间
          wx.cloud.uploadFile({
            // 指定要上传的文件的小程序临时文件路径
            cloudPath: that.timetostr(new Date()),
            filePath: res.tempFilePaths[i],
            // 成功回调
            success: res => {
              that.data.images.push(res.fileID)
            },
          })
        }
      },
    })
  },
  /**
   * 图片路径格式化
   */
  timetostr(time) {
    var randnum = Math.floor(Math.random() * (9999 - 1000)) + 1000;
    var str = randnum + "_" + time.getMilliseconds() + ".png";
    return str;
  },
  /**
   * 删除图片
   */
  removeImg: function (event) {
    var position = event.currentTarget.dataset.index;
    this.data.images.splice(position, 1);
    // 渲染图片
    this.setData({
      images: this.data.images,
    })
  },
  // 预览图片
  previewImg: function (e) {
    //获取当前图片的下标
    var index = e.currentTarget.dataset.index;
    wx.previewImage({
      //当前显示图片
      current: this.data.images[index],
      //所有图片
      urls: this.data.images
    })
  },
  /**
   * 发布
   */
  formSubmit: function (e) {
    console.log('图片：', this.data.images)

    this.data.content = e.detail.value['input-content'];
    if (this.data.canIUse) {
      if (this.data.images.length > 0) {
        this.saveDataToServer();
      } else if (this.data.content.trim() != '') {
        this.saveDataToServer();
      } else {
        wx.showToast({
          icon: 'none',
          title: '写点东西吧',
        })
      }
    } 
  },



  /**
   * 保存到发布集合中
   */
  saveDataToServer: function (event) {
    db.collection('topic').add({
      
      // data 字段表示需新增的 JSON 数据
      data: {
        content: this.data.content,
        date: new Date(),
        images: this.data.images,
        user: this.data.user,
        isLike: this.data.isLike,
        paths: this.data.paths, 
      },
      success: function (res) {
        // 保存到发布历史
        // 清空数据
        this.setData({
          textContent: '',
          images: [],
        })
      },
    })
    this.saveToHistoryServer();
    this.showTipAndSwitchTab();
  },
  
  /**
   * 添加到发布集合中
   */
  saveToHistoryServer: function (event) {
    db.collection('myactive').add({
      // data 字段表示需新增的 JSON 数据
      data: {
        content: this.data.content,
        date: new Date(),
        images: this.data.images,
        user: this.data.user,
        isLike: this.data.isLike,
        paths: this.data.paths,
      },
      success: function (res) {
        // res 是一个对象，其中有 _id 字段标记刚创建的记录的 id
        console.log(res)
      },
      fail: console.error()
    })
  },

  /**
    * 添加成功添加提示，切换页面
    */
  showTipAndSwitchTab: function (event) {
    wx.showToast({
      title: '新增记录成功',
    })
    wx.navigateTo({
      url: '../home/home',
    })
  },
  
})