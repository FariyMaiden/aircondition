// pages/airCondition/airCondition.js
Page({
  //页面的初始数据
  data: {

    inputData: false,
    shakeValue: '',

    status:'',//适配器的是否可用
    isSearch:'',//是否在搜索
    searchDeviceList:[],//搜索到的设备列表
    macs:[],//设备的mac地址
    choseMac: '',
    choseName: '',
    
    connectedDeviceId:'',//当前连接的设备ID
    receiveData:'',//接受到的信息
    //showParams:true,//显示参数
    platform: '',//手机平台 ios还是安卓

    connectedDeviceId: "", //已连接设备uuid  
    services: "", // 连接设备的服务  
    characteristics: "",   // 连接设备的状态值  
    writeServicweId: "", // 可写服务uuid  
    writeCharacteristicsId: "",//可写特征值uuid  
    readServicweId: "", // 可读服务uuid  
    readCharacteristicsId: "",//可读特征值uuid  
    notifyServicweId: "", //通知服务UUid  
    notifyCharacteristicsId: "", //通知特征值UUID  
    inputValue: "FEFEFEFE68AAAAAAAAAAAA681300DF16",
    characteristics1: "", // 连接设备的状态值 

    upParams:{
      serverIP:'',
      port:0,//int
      gate:'',
      user:'',
      password:'',
      clientID:'',
      publishTopic:'',
      subscribeTopic:'',
      readCycle: 0,//抄表周期 int
      productKey:'',
      deviceSecret:'',
      deviceName:'', 
    },

    //参数
    upParamsEnglishName: ['serverIP', 'port', 'gate', 'user', 'password', 'clientID', 'publishTopic', 'subscribeTopic', 'readCycle'],
    upParamsChineseName: ['服务器：', '端口：', '网关：', '用户：', '密码：', 'clientID：', '发布Topic：', '订阅Topic：', '抄表周期：'],
    downParams:[
       {
      //   address:'',//地址
      //   protocol:'Lora',//协议
      //   speedRate:'',//速率
      //   bit:'',//bit位
      //   parity:'',//奇偶位
      //   stop:'',//停止位
      //   way: '',//方式
      //   deviceType:'',//设备类型
      //   retryCount:'',//重试次数   
      //   ct:'',//电流变比 
       }
    ],
    
    //下行参数 设备档案
    protocol: ['DLT645', 'CJT188', 'modBus', 'Lora'],
    bits: ['7', '8'],
    paritys: ['None', 'Odd', 'Even'],
    stops: ['1', '2'],
    way: ['RS485', 'Lora'],
    deviceType: ['电表', '水表', '传感器', '控制器', '冷量表', '客流计数器'],
    speedRate: ['1200', '2400', '4800', '9600'],
    
    // addDevice:{
    //     address:'',//地址
    //     protocol:'',//协议 ********
    //     speedRate:'',//速率
    //     bit:'',//bit位
    //     parity:'',//奇偶位***********
    //     stop:'',//停止位
    //     way: '',//方式************
    //     deviceType:'',//设备类型************8
    //     retryCount:'',//重试次数   
    //     ct:'',//电流变比
    // },

    deviceCount:0,//网关下子设备的数量
    operationIndex:-1,//要修改，删除所对应的设备的索引

    resendCount:0,//重发次数

    oldTimeStamp: 0,//时间戳，用于控制下拉刷新的时间间隔
    dataOil: 0,//发送数据的具体帧数
    fullOil: 0,//总共要发送的总帧数
    sendDataString: '',//要发送的数据json字符串
    timeOut:true,//判断连接是否超时
    
  },
  
  // 输入子设备序列号查询

  // clickTo: function () {

  //   this.setData({
  //     inputData: true
  //   })

  // },

  // formSubmit: function (e) {

  //   if (e.detail.value.shakeValue < 15 && e.detail.value.shakeValue > 0) {
  //     this.setData({
  //       inputData: false,
  //       shakeValue: parseInt(e.detail.value.shakeValue)
  //     })
  //     var params = {
  //       operation:1,
  //       deviceNo: parseInt(e.detail.value.shakeValue) 
  //     }
  //      this.lanya8(params)
  //     console.log(e.detail.value.shakeValue)
  //   } else {
  //     wx.showModal({
  //       title: '提示',
  //       content: '此子设备不存在',
  //     })
  //     this.setData({
  //       inputData:false
  //     })
  //   }

  //   console.log(this.data.inputData)
  //   console.log(this.data.shakeValue)
  // },



  // 输入数字查询子设备
  // formSubmit:function(e){
  //   console.log("154154964515485435156",e)
  //   var params = {
  //     operation:1,
  //     deviceNo: parseInt(e.detail.value.myvalue) 
  //   }
  //     this.lanya8(params)
  //     console.log("哈啰！我是~~~~"+params)
  // },


  
   //生命周期函数--监听页面加载  
  onLoad: function (options) {  
    var that = this
    // 获取手机平台信息
    wx.getSystemInfo({
      success: function (res) {
        console.log(res.platform)
        that.setData({
          platform: res.platform
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },
  
   // 刷新
  refresh:function(){
    this.setData({
      showParams:false,
      downParams:[]
    })
    var  params = {
      operation:0
    } 
    this.lanya8(params)
  },

   // 上行参数的改变
   
  upParamsChange:function(event){
    var tempParams = this.data.upParams
    var key = event.currentTarget.dataset.type

    if (key == 'port' || key == 'readCycle'){
      tempParams[key] = parseInt(event.detail.value.trim()) 
    }else{
      tempParams[key] = event.detail.value.trim()
    }

    this.setData({
      upParams:tempParams
    })

    console.log(this.data.upParams)
  },

  /**
   * 选择值
   */
  choseValue:function(event){
    var that = this
    var deviceIndex = event.currentTarget.dataset.index
    var temp = this.data.downParams

    // 确定选择列表
    var key = event.currentTarget.dataset.type
    var tempItemList = []
    if (key == "protocol") {
      tempItemList = this.data.protocol
    } else if (key == "way") {
      tempItemList = this.data.way
    } else if (key == "bit") {
      tempItemList = this.data.bits
    }else if(key == 'parity'){
      tempItemList = this.data.paritys
    } else if (key == 'stop') {
      tempItemList = this.data.stops
    }else if (key == "deviceType") {
      tempItemList = this.data.deviceType  
    }else if (key == 'speedRate'){
      tempItemList = this.data.speedRate
    }
    wx.showActionSheet({
      itemList: tempItemList,
      success: function (res) {
        temp[deviceIndex][key] = tempItemList[res.tapIndex]
        that.setData({
          downParams: temp
        })
      },
      fail: function (res) {
        console.log(res.errMsg)
      }
    })
  },
  /**
   * 子设备参数修改值
   */
  downParamsChange:function(event){
  
    var key = event.currentTarget.dataset.type
    console.log(key)
    var index = event.currentTarget.dataset.index
    console.log(index)
    var value = event.detail.value.trim()
    console.log(value)
    var temp = this.data.downParams
    temp[index][key] = value

    this.setData({
      downParams:temp
    })

    console.log(temp)

  },
  /**
   * 监听回调的数据
   * addDevice
   */
  // listenAddDeviceValueChange:function(key,value){
  //   var temp = this.data.addDevice
  //   temp[key] = value

  //   this.setData({
  //     addDevice: temp
  //   })

    // console.log(this.data.addDevice)

  // },

  /**
   * 将接受到的子设备下行参数，转化成可视化数据
   *    address:'',//地址
        protocol:'',//协议********
        speedRate:'',//速率
        bit:'',//bit位
        parity:'',//奇偶位**********
        stop:'',//停止位
        way: '',//方式*********
        deviceType:'',//设备类型************
        retryCount:'',//重试次数
   */
  changeAcceptDataToVisiabled(data){

    console.log('要改变的数据'+JSON.stringify(data))
    // console.log(typeof(data))
    var visiabledData = [];
    console.log('数组长度'+data.length)
    if(data != null){
      for (var i = 0; i < data.length; i++) {

        var item = {
          address: data[i].address,
          protocol: this.data.protocol[parseInt(data[i].protocol)],
          speedRate: data[i].speedRate,
          bit: data[i].bit,
          stop: data[i].stop,
          parity: this.data.paritys[parseInt(data[i].parity)],
          way: this.data.way[parseInt(data[i].way)],
          deviceType: this.data.deviceType[parseInt(data[i].deviceType)],
          retryCount: data[i].retryCount,
          ct: data[i].ct
        }
        visiabledData.push(item)
      }
    }
    return visiabledData
  },
  /**
   * 将可视的数据转化成传输格式的数据
   */
  changeVisiabledDataToSendData(visiabledData){
    var sendData = {
      address: visiabledData.address,
      protocol: this.indexOfArray(this.data.protocol, visiabledData.protocol),
      speedRate: parseInt(visiabledData.speedRate) ,
      bit: parseInt(visiabledData.bit),
      stop: parseInt(visiabledData.stop),
      retryCount: parseInt(visiabledData.retryCount) ,
      parity: this.indexOfArray(this.data.paritys, visiabledData.parity),
      way: this.indexOfArray(this.data.way, visiabledData.way),
      deviceType: this.indexOfArray(this.data.deviceType, visiabledData.deviceType),
      ct: parseInt(visiabledData.ct)
      // ct:visiabledData.ct
    }
    return sendData
  },

  /**
   * 找出元素的索引
   */
  indexOfArray(arr,item){
    console.log(item)
    console.log(JSON.stringify(arr))
    for (var i = 0; i < arr.length; i++) {
      if (arr[i] === item) {
        return i;
      }
    }
    return -1;
  },
  /**
   * 提示框
   */
  showModal(message){
    wx.showModal({
      title: '提示',
      content: message,
      success: function (res) {
        if (res.confirm) {
        }
         else if (res.cancel) {   
        }
      }
    })
  },
 

  /**
   * 跳转到添加设备页面
   */
  toAddDevicePage:function(){
    wx.navigateTo({
      url: '../addDevice/addDevice'
    })
  },

  /**
   * 设置上行参数
   */
  setUpParams: function () {
    var params = {
      operation:2,
      upParams: this.data.upParams
    }
    this.lanya8(params)
  },

  /**
   * 查询接下来的5个子设备
   */
  queryNext5Device:function(){

    var newTimeStamp = new Date().getTime()
    var timeinterval = newTimeStamp - this.data.oldTimeStamp
    this.setData({
      oldTimeStamp: newTimeStamp
    })

    // 小于1秒，不再执行
    if (timeinterval < 1000) {
      return
    }

    var that = this


    // setTimeout(function () {

    console.log('数据源长度' + that.data.downParams.length)
    console.log('设备总数' + that.data.deviceCount)
    if (that.data.downParams.length < that.data.deviceCount && that.data.showParams) {
      console.log('刷新')
      var params = {
        operation: 1,
        deviceNo: that.data.downParams.length
      }

    //   wx.showLoading({
    //     title: '发送中',
    //     mask: true,
    //   })
       that.lanya8(params)
     }

    // }, 500)



  },


  /**
   * 设置子设备参数
   */
  setDeviceParams:function(event){
    var index = event.currentTarget.dataset.index
    if (this.data.downParams[index]['address'].length != 12){
      this.showModal('地址长度必须是12位')
    }else{
      var params = {
        operation: 3,
        deviceNo: index,
        device: this.changeVisiabledDataToSendData(this.data.downParams[index])
      }
      this.lanya8(params)
    }

    

  },

  /**
   * 增加子设备
   */
  addDevice:function(item){
    var that = this
    var params = {
      operation: 4,
      device: this.changeVisiabledDataToSendData(item) 
    }
    console.log('出错没')
    setTimeout(function(){
      that.lanya8(params)
    },100)
    
  },

  /**
   * 删除子设备
   */
  deleteDevice:function(event){
    var index = event.currentTarget.dataset.index
    var params = {
      operation: 5,
      deviceNo: index
    }
    this.setData({
      operationIndex: index
    })
    var that = this
    wx.showModal({
      title: '提示',
      content: '你确认要删除第' + (index+1) + "个设备吗？",
      success: function (res) {
        if (res.confirm) {
          that.lanya8(params)
        } else if (res.cancel) {
        }
      }
    })  
  },
  /**
   * 点击搜索按钮的事件
   */
  foundLanya() {
   
    // 清空搜索列表
    this.setData({
      searchDeviceList: [],
      showParams: false,
      downParams: [],
      connectedDeviceId: '',//清空连接id
    })

    // 断开蓝牙连接
    this.closeBLEConnection()

    // 关闭蓝牙适配器
    this.closeBluetoothAdapter()


    var that = this
    setTimeout(function () {
      that.openBluetoothAdapter()
    }, 500)
    // 开启蓝牙适配器

  },

  

  /**
   *蓝牙事件处理
   */


  /**
   * 监听蓝牙适配器
   */
  onBluetoothAdapterStateChange() {
    var that = this

    wx.onBluetoothAdapterStateChange(function (res) {

      that.setData({
        isSearch: res.discovering ? "在搜索。" : "未搜索。",
        status: res.available ? "可用。" : "不可用。",
      })

      // 如果蓝牙不可用时
      if (!res.available){
        that.setData({
          showParams:false,//隐藏
          searchDeviceList:[],//清除设备列表
        })
      }
     
      
    })

  },


  /**
   * 初始化蓝牙适配器
   */
  openBluetoothAdapter() {
    // 监听
    this.onBluetoothAdapterStateChange()

    var that = this
    console.log('开启蓝牙适配')
    wx.openBluetoothAdapter({
      success: function (res) {
        wx.hideLoading()
        
        // 读取状态
        that.getBluetoothAdapterState()


      },
      fail(res) {
        wx.showToast({

          title: '蓝牙初始化失败',

          mask: true,

          icon: 'success',

          duration: 2000

        }),
          console.log(res)
      }
    })
  },

  /**
   * 关闭蓝牙适配器
   */
  closeBluetoothAdapter() {
    wx.closeBluetoothAdapter({
      success: function (res) { },
      fail: function (res) { },
      complete: function (res) { },
    })
  },



  /**
   * 获取蓝牙适配器的状态
   */
  getBluetoothAdapterState() {
    var that = this;
    console.log('获取并监听本机蓝牙状态')
    wx.getBluetoothAdapterState({
      success: function (res) {
        console.log(res)
        that.setData({
          isSearch: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })

        if (res.available) {
          // 开始搜索
          that.startBluetoothDevicesDiscovery()
        }

      }
    })
  },

  /**
   * 开始搜索设备
   */
  startBluetoothDevicesDiscovery() {

    // 断开已有的连接
    this.closeBLEConnection()

    this.setData({
      receiveData: '',
    })

    // 监听搜索到的设备
    this.onBluetoothDeviceFound()

    // 监听设备的连接状态
    this.onBLEConnectionStateChange()

    var that = this;

    wx.showLoading({
      title: '搜索设备',
      mask: true,
    })
    wx.startBluetoothDevicesDiscovery({
      // services: ['FEE7','FFB0'],

      success: function (res) {

        // wx.hideLoading()

        console.log('成功开始蓝牙搜索')

      },
      complete: function (res) {
        // console.log(res)
        wx.hideLoading()
      }
    })
  },

    // 获取已连接的设备
  
 getConnectedBluetoothDevices(){
  
 },
   

  /**
   * 监听搜索到的新设备
   * 监听到的是一个数组，但是数组里面只有一个设备
   * 
   */
  onBluetoothDeviceFound() {
    var that = this
    wx.onBluetoothDeviceFound(function (res) {

      // console.log('新设备名' + res.devices[0].name)
      
      // console.log('监听' + JSON.stringify(res))

      // 判断是否有广播服务 与名字是否有指定相关的字符串
      var name = res.devices[0]['name']
      // && name != '' && name.indexOf('BleS') != -1
      if (res.devices[0].advertisData != null && name != '' && (name.indexOf("BleS") != -1)){
        var mac = that.buf2hex(res.devices[0].advertisData).substring(4)
        console.log('full'+that.buf2hex(res.devices[0].advertisData))

        // 标记,是否已经发现过此设备
        var isnotExist = true

        for (var i = 0; i < that.data.searchDeviceList.length; i++) {
          if (res.devices[0].deviceId == that.data.searchDeviceList[i].deviceId) {
            isnotExist = false //存在
          }
        }

        // 如果是安卓手机，还要判断mac与deviceid是否相同
        console.log(mac)
        var device = res.devices[0].deviceId.replace(/:/g, '')
        console.log(device)

        // if (that.data.platform != 'ios' && mac.toUpperCase() != device) {
        //   isnotExist = false
        // }

        if (isnotExist) {
          that.setData({
            searchDeviceList: that.data.searchDeviceList.concat(res.devices),
            macs: that.data.macs.concat([mac])
          })
        }
      }

     
    })
  },

  /**
   * 停止搜索设备
   */
  stopBluetoothDevicesDiscovery() {
    var that = this
    wx.stopBluetoothDevicesDiscovery({
      success: function (res) {
        that.setData({
          isSearch: res.discovering ? "在搜索。" : "未搜索。",
          status: res.available ? "可用。" : "不可用。",
        })
      },
      fail: function (res) { },
      complete: function (res) { },
    })
  },

  /**
  * 连接设备
  */
  createBLEConnection(e) {

    // 断开设备
    this.closeBLEConnection(
     
    )

    var that = this;

    wx.showLoading({
      title: '连接中',
      mask: true,
    })

    var index = e.currentTarget.dataset.index

    setTimeout(function () {
      wx.createBLEConnection({
        deviceId: e.currentTarget.id,
        success: function (res) {

          console.log(res.errMsg);
          that.setData({
            connectedDeviceId: e.currentTarget.id,
            choseMac: that.data.macs[index],
            choseName: that.data.searchDeviceList[index].name,
          })
          // 获取服务和特征
          that.getBLEDeviceServices()
        },
        fail: function (res) {
          console.log(res)
          console.log("连接失败");
          wx.hideLoading()
          wx.showModal({
            title: '失败',
            content: '连接失败',
            success: function (res) {
              if (res.confirm) {
              } else if (res.cancel) {
              }
            }
          })
        },
        complete: function () {
        }
      })
    }, 500)
  },
  /**
    * 监听设备的连接状态
    */
    //出现异常断开连接出现弹框
  onBLEConnectionStateChange: function () {
    var that = this
    console.log('开始监听设备连接状态')
    wx.onBLEConnectionStateChange(function (res) {
      if (!res.connected) {
        var oldDevice = res.deviceId//上一次连接的deviceId
        console.log(res.deviceId + '断开')
        wx.showModal({
          title: '提示',
          content: '连接已断开，请重新连接。',
          showCancel:false,
          success: function (res) {
            if (res.confirm) {
            // 断开连接后，将原来的数据清空
                 wx.hideLoading()             
                 that.setData({
                  searchDeviceList: [],
                  showParams: false,
                  downParams: [],
                  connectedDeviceId: '',//清空连接id
                 })
                console.log('用户点击确定')
            }        
             else if (res.cancel) {
              wx.hideLoading()            
              console.log('用户点击取消')
            }
          }
        })  
        //wx.hideLoading()
        // // 断开连接后，将原来的数据清空
        // that.setData({
        //   showParams: false,
        //   downParams: [],
        //   connectedDeviceId: '',//清空连接id
        // })
      } 
      else {
        console.log(res.deviceId + '连接')
      }
    })
  },

  /**
   * 获取设备的服务
   */
  getBLEDeviceServices() {
    var that = this;
    // wx.showLoading({
    //   title: '获取服务',
    //   mask: true,
    // })

    wx.getBLEDeviceServices({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        console.log('device services:', JSON.stringify(res.services));
        that.setData({
          services: res.services,
        })

        that.getBLEDeviceCharacteristics()
      },
      fail: function (res) {
        console.log(res)
        wx.hideLoading()
      },
      complete() {

      }
    })
  },

  /**
  * 获取连接设备的所有特征值
  *
  *
  */
  getBLEDeviceCharacteristics: function () {
    var that = this;
    // wx.showLoading({
    //   title: '获取特征',
    //   mask: true,
    // })
    wx.getBLEDeviceCharacteristics({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.services[0].uuid,
      success: function (res) {

        console.log('特征值：' + JSON.stringify(res.characteristics))

        if (that.data.services.length % 2 != 0) {
          // 旧版本
          that.setData({
            notifyServicweId: that.data.services[0].uuid,
            notifyCharacteristicsId: res.characteristics[1].uuid,
            writeServicweId: that.data.services[0].uuid,
            writeCharacteristicsId: res.characteristics[0].uuid,

          })

        } else {
          // 新版本
          for (var i = 0; i < res.characteristics.length; i++) {
            if (res.characteristics[i].properties.notify || res.characteristics[i].properties.indicate) {
              that.setData({
                notifyServicweId: that.data.services[0].uuid,
                notifyCharacteristicsId: res.characteristics[i].uuid,
              })
            }
            if (res.characteristics[i].properties.write) {
              that.setData({
                writeServicweId: that.data.services[0].uuid,
                writeCharacteristicsId: res.characteristics[i].uuid,
              })

            } else if (res.characteristics[i].properties.read) {
              that.setData({
                readServicweId: that.data.services[0].uuid,
                readCharacteristicsId: res.characteristics[i].uuid,
              })
            }
          }

        }



        //  启用蓝牙特征值变化是的notify功能
        that.notifyBLECharacteristicValueChange()

        // 获取设备发送回来回调的数据 
        // that.onBLECharacteristicValueChange()



      },
      fail: function (res) {

        console.log("获取特征值失败");
        console(res)
        wx.hideLoading()
      },
      complete: function () {

      }
    })
  },


  /**
   *启用低功耗蓝牙设备特征值变化时的 notify 功能
   */
  notifyBLECharacteristicValueChange: function () {
    var that = this;

    wx.notifyBLECharacteristicValueChange({
      state: true, // 启用 notify 功能  
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.notifyServicweId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      characteristicId: that.data.notifyCharacteristicsId,
      success: function (res) {
        console.log('启用notify功能')
        // wx.hideLoading()
        // 发送数据
        // 连接设备后立刻查看上行参数
        var params = {
          operation: 0
        }

        that.lanya8(params)


      },
      fail: function () {
        console.log('启用notify失败');
        wx.hideLoading()
        console.log(that.data.notifyServicweId);
        console.log(that.data.notifyCharacteristicsId);
      },
    })
  },

  /**
   * 获取设备回调发送回来的数据
   * 
   * 
   * 
   * 
   * 
   */
  onBLECharacteristicValueChange(params) {


    // this.setData({
    //   receiveData: ''
    // })

    var that = this
    wx.onBLECharacteristicValueChange(function (characteristic) {

      console.log('监听回调')
      const result = characteristic.value;

      var hex = that.data.receiveData + that.buf2hex(result)

      that.setData({
        receiveData: hex
      })



      // 判断字符串是否已03结尾
      if (hex.substring(hex.length - 2) == '03') {

        that.setData({
          timeOut: false,//没有超时
        })
        console.log('数据接受完毕')
        // 删除最后一个字节
        var resultString = hex.substring(0, hex.length - 2)
        // 将hex转换成bufferArray
        var resultBuffer = that.hexStringToBuf(resultString)
        // 将arrayBuffer转换成json字符串

        console.log(that.bytesToString(resultBuffer))
        console.log(that.bytesToString(resultBuffer).length)

        try {
          var resultJSON = JSON.parse(that.bytesToString(resultBuffer))


          // 根据不同的params设置不同的值
          if (params.operation == 0) {

            if (resultJSON.status == 1) {

              wx.hideLoading()

              that.setData({
                showParams: true,//显示参数
                upParams: resultJSON.upParams,
                deviceCount: resultJSON.deviceCount,
                resendCount: 0,//清空发送次数
                timeOut:false,//没有超时
              })

              // 成功之后查询前五个子设备的信息
              // 延迟500毫秒再发送
              // setTimeout(function(){
              //   that.queryNext5Device()
              // },500)



            } else {
              // 提示错误
              if (that.data.resendCount < 3) {
                setTimeout(function () {
                  console.log('重新发送数据')
                  that.lanya8(params)
                }, 500)

              } else {
                that.setData({
                  resendCount: 0
                })
                wx.hideLoading();
                that.showModal('查询系统参数失败')
              }
            }



          } else if (params.operation == 1) {
            // 查看子设备列表信息
            wx.hideLoading()
            if (resultJSON.status == 1 && that.data.downParams.length < that.data.deviceCount) {
              
              // 请求成功，次数清零
              that.setData({
                resendCount: 0,
                timeOut: false,//没有超时
              })

              var is_exit = false
              // 判断请求回来的子设备是否已经存在
              for (var i = 0; i < that.data.downParams.length; i++) {
                if (resultJSON.device[0].block == that.data.downParams[i].block) {
                  is_exit = true
                  break;
                }
              }
              // 不存在的时候添加到数据源
              if (!is_exit) {
                console.log('hello')
                that.setData({
                  // scrollTop:that.data.scrollTop+10,
                  downParams: that.data.downParams.concat(that.changeAcceptDataToVisiabled(resultJSON.device)),
                })
              }



            } else {
              // 提示错误
              if (that.data.resendCount < 3) {
                setTimeout(function () {
                  that.lanya8(params)
                }, 500)

              } else {
                that.setData({
                  resendCount: 0
                })
                // that.showModal('请重新发送数据')
              }
            }

          } else if (params.operation == 4) {
            // 增加设备
            if (resultJSON.status == 1) {
              wx.hideLoading()
              // 提示成功
              wx.showToast({
                title: '添加成功',
                mask: true,
                icon: 'success',
                duration: 1000
              })

              // 设备总数+1            
              that.setData({
                deviceCount: that.data.deviceCount + 1,
                resendCount: 0,
                timeOut: false,//没有超时
              })

              setTimeout(function () {
                that.queryNext5Device();
              }, 1000)



            } else {
              // 提示失败

              if (that.data.resendCount < 3) {
                setTimeout(function () {
                  that.lanya8(params)
                }, 500)
              } else {

                that.setData({
                  resendCount: 0
                })
                wx.hideLoading()
                that.showModal('请重新添加')
              }
            }

          } else if (params.operation == 2) {
            // 修改系统参数
            if (resultJSON.status == 1) {
              wx.hideLoading()
              // 提示成功
              wx.showToast({
                title: '修改成功',
                mask: true,
                icon: 'success',
                duration: 2000
              })
              that.setData({
                resendCount: 0,
                timeOut: false,//没有超时
              })

            } else {

              if (that.data.resendCount <= 3) {

                setTimeout(function () {
                  that.lanya8(params)
                }, 500)

              } else {
                that.setData({
                  resendCount: 0
                })
                wx.hideLoading()
                that.showModal('修改失败')
              }
            }
            // setTimeout(function () {
            //   that.refresh();
            // }, 2000)
          } else if (params.operation == 3) {
            // 修改子设备参数
            if (resultJSON.status == 1) {
              wx.hideLoading()
              // 提示成功
              wx.showToast({
                title: '修改成功',
                mask: true,
                icon: 'success',
                duration: 2000
              })

              that.setData({
                resendCount: 0,
                timeOut: false,//没有超时
              })

            } else {
              // 提示失败
              if (that.data.resendCount < 3) {

                setTimeout(function () {
                  that.lanya8(params)
                }, 500)

              } else {
                that.setData({
                  resendCount: 0
                })
                wx.hideLoading()
                that.showModal('修改设备参数失败')
              }
            }
            // setTimeout(function () {
            //   that.refresh();
            // }, 2000)
          } else if (params.operation == 5) {
            // 删除子设备
            if (resultJSON.status == 1) {
              wx.hideLoading()
              // 提示成功
              wx.showToast({
                title: '删除成功',
                mask: true,
                icon: 'success',
                duration: 2000
              })
              that.data.downParams.splice(that.data.operationIndex, 1)

              // 修改对应的数据
              that.setData({
                resendCount: 0,
                deviceCount: that.data.deviceCount - 1,//设备数-1
                downParams: that.data.downParams,//删除对应的数据源
                timeOut: false,//没有超时
              })



            } else {
              // 提示失败
              if (that.data.resendCount < 3) {

                setTimeout(function () {
                  that.lanya8(params)
                }, 500)

              } else {
                that.setData({
                  resendCount: 0
                })
                wx.hideLoading()
                that.showModal('删除失败')
              }
            }
          }









        } catch (e) {
          if (that.data.resendCount < 3) {
            // 查询的时候发生语法错误会进行
            if (params.operation == 0 || params.operation == 1) {
              setTimeout(function () {
                that.lanya8(params)
              }, 500)
            }

          } else {
            that.setData({
              resendCount: 0
            })
            wx.hideLoading()
            if (operation != 1) {
              that.showModal('接受数据丢帧')
            }

            return
          }

        }


        // console.log(JSON.stringify(resultJSON))




      }


    })
  },


  //发送 或者 重新发送 
  lanya8: function (params) {
    var that = this;

    // 重新请求的时候不在触发 而且不是查询子设备操作

    if (that.data.resendCount == 0) {
      wx.showLoading({
        title: '发送中',
        // mask: true,
      })
      setTimeout(_ => {
        if (that.data.timeOut) {
          that.closeBLEConnection()
        }
      }, 15000)
    }

    this.onBLECharacteristicValueChange(params)

    console.log(JSON.stringify(params))

    var sendString = JSON.stringify(params) + "\u0003"

    var times = Math.ceil(sendString.length / 20) //发包发的次数

    this.setData({
      dataOil: 0,//发送帧回0
      fullOil: times,//总帧数
      sendDataString: sendString,
      receiveData: '',//清空之前接受到的数据
      resendCount: that.data.resendCount + 1,//整个json数据发送的次数，最大不超过3
      timeOut:true,//默认是超时
    })

    

    this.beforeSendData()

  },

  /**
   * 发送数据前的封装
   */
  beforeSendData() {
    var oils = this.data.dataOil
    var sendString = this.data.sendDataString.substring(20 * oils, 20 * (oils + 1))

    if (this.data.dataOil < this.data.fullOil) {
      console.log('发送第' + oils + '帧')
      this.writeBLECharacteristicValue(sendString)
    }

  },


  /**
   * 发送蓝牙数据
   */
  writeBLECharacteristicValue: function (data) {
    var that = this

    var buffer = that.stringToBytes(data)

    wx.writeBLECharacteristicValue({
      // 这里的 deviceId 需要在上面的 getBluetoothDevices 或 onBluetoothDeviceFound 接口中获取  
      deviceId: that.data.connectedDeviceId,
      // 这里的 serviceId 需要在上面的 getBLEDeviceServices 接口中获取  
      serviceId: that.data.writeServicweId,
      // 这里的 characteristicId 需要在上面的 getBLEDeviceCharacteristics 接口中获取  
      characteristicId: that.data.writeCharacteristicsId,
      // characteristicId:'0000FFB1-0000-1000-8000-00805F9B34FB',
      // 这里的value是ArrayBuffer类型  
      value: buffer,
      success: function (res) {
        console.log('成功写入,准备发送夏一帧')
        that.setData({
          dataOil: that.data.dataOil + 1,
        })

        //为了照顾某些安卓机，延迟250毫秒进行发送
        setTimeout(function () {
          that.beforeSendData()
        }, 50)



      },
      fail(res) {
        // 断开连接
        console.log('写入失败，准备重发')
        that.beforeSendData()
      }
    })

  },

  //断开设备连接  
  closeBLEConnection: function () {

    this.setData({
      receiveData: ''
    })

    var that = this;
    wx.closeBLEConnection({
      deviceId: that.data.connectedDeviceId,
      success: function (res) {
        that.setData({
          connectedDeviceId: "",
        })
        console.log('断开连接')
      }
    })
  },


  // 字符串转byte  
  stringToBytes: function (str) {
    console.log(str.length)

    var array = new Uint8Array(str.length);
    for (var i = 0, l = str.length; i < l; i++) {
      array[i] = str.charCodeAt(i);
    }
    console.log(array);
    return array.buffer;
  },

  bytesToString(buf) {
    return String.fromCharCode.apply(null, new Uint8Array(buf));
  },

  /**
 * ArrayBuffer 转换为  Hex
 */
  buf2hex: function (buffer) { // buffer is an ArrayBuffer
    return Array.prototype.map.call(new Uint8Array(buffer), x => ('00' + x.toString(16)).slice(-2)).join('');
  },

  /**
   * hex 转换成 ArrayBuffer
   */
  hexStringToBuf: function (hexString) {
    var typedArray = new Uint8Array(hexString.match(/[\da-f]{2}/gi).map(function (h) {
      return parseInt(h, 16)
    }))

    return typedArray.buffer

  },
// ArrayBuffer转为字符串，参数为ArrayBuffer对象
  // ab2str(buf) {
  //   return String.fromCharCode.apply(null, new Uint16Array(buf));
  // },

// 字符串转为ArrayBuffer对象，参数为字符串
  // str2ab(str) {
  //   var buf = new ArrayBuffer(str.length * 2); // 每个字符占用2个字节
  //   var bufView = new Uint16Array(buf);
  //   for (var i = 0, strLen = str.length; i < strLen; i++) {
  //     bufView[i] = str.charCodeAt(i);
  //   }
  //   return buf;
  // },

 



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
    console.log(this.data.upWalk)
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
    // this.queryNext5Device()
    console.log("已经到底了")
  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function () {
  
  }

 
})