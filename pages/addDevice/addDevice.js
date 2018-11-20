// pages/addDevice/addDevice.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    protocol: ['DLT645','CJT188','modBus', 'Lora'],
    bits: ['7', '8'],
    paritys: ['None', 'Odd', 'Even'],
    stops: ['1', '2'],
    way: ['RS485', 'Lora'],
    deviceType: ['电表','水表','传感器','控制器','冷量表','客流计数器'],
    speedRate: ['1200', '2400', '4800','9600'],

    addDevice: {
      address: '000000000001',//地址
      protocol: 'DLT645',//协议
      speedRate: '9600',//速率
      bit: '8',//bit位
      parity: 'Even',//奇偶位
      stop: '1',//停止位
      way: 'RS485',//方式
      deviceType: '电表',//设备类型
      ct: '0001',//电流变比
      retryCount: '3',//重试次数     
    }
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
  
  },


  /**
   * 添加设备
   */
  addDevice:function(){

    if (this.data.addDevice.address.length != 12){
      wx.showModal({
        title: '提示',
        content: '地址长度必须为12位',
        success: function (res) {
          if (res.confirm) {
          } else if (res.cancel) {
         
          }
        }
      })
    }else{
      var pages = getCurrentPages();
      var prePage = pages[pages.length - 2]
      // prePage.foundLanya()
      prePage.addDevice(this.data.addDevice)

      wx.navigateBack({
        delta: 1,
      })
    }

  },
  
  /**
   * 监听值的变化
   */
  paramsChange:function(event){
    var key = event.currentTarget.dataset.type
    var value = event.detail.value.trim()

    // var pages = getCurrentPages();
    // var prePage = pages[pages.length - 2]

    // prePage.listenAddDeviceValueChange(key,value)
    var temp = this.data.addDevice
    temp[key] = value
    this.setData({
      addDevice: temp
    })
  },

  choseValue:function(event){
    var that = this
    var key = event.currentTarget.dataset.type
    var tempItemList = []
    if (key == "protocol") {
      tempItemList = this.data.protocol
    } else if (key == "way") {
      tempItemList = this.data.way
    } else if (key == "bit") {
      tempItemList = this.data.bits
    } else if (key == 'parity') {
      tempItemList = this.data.paritys
    } else if (key == 'stop') {
      tempItemList = this.data.stops
    } else if (key == "deviceType") {
      tempItemList = this.data.deviceType
    } else if (key == "speedRate"){
      tempItemList = this.data.speedRate
    } 
    wx.showActionSheet({
      itemList: tempItemList,
      success: function(res) {

        // var pages = getCurrentPages();
        // var prePage = pages[pages.length - 2]
        // prePage.listenAddDeviceValueChange(key, tempItemList[res.tapIndex])

        var temp = that.data.addDevice
        temp[key] = tempItemList[res.tapIndex]
        
        that.setData({
          addDevice:temp
        })
      },
      fail: function(res) {},
      complete: function(res) {},
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
  
  }
})