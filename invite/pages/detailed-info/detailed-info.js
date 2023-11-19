// invite/pages/detailed-info/detailed-info.js
Page({
  data: {
    visitorName: '',  // 初始化为空
    visitorCompany:'',
    visitorReason:'',
    visitorPerson:'',
    visitorPhone:'',
    visitorAreas:'',
    visitorCarnum:'',
    equipment:'',
    hiddenems: false, // 设置为布尔值 true
    hiddeneque: false,
  },

  onLoad(options) {
    console.log('接收到的参数是：', options.uuid);
      // 模拟从后端获取数
      const uuid = options.uuid;
  // 发送数据到后端
  wx.request({
    url: 'http://localhost:8081/detailed',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      uuid: uuid
    },
    success: (res) => {
      // 使用从后端接收的数据更新前端数据属性
      console.log(res.data)
      this.setData({
        visitorName: res.data.visitorName,
        visitorCompany: res.data.affiliatedUnit,
        visitorReason: res.data.visitreason,
        visitorPerson: res.data.visitorPerson,
        visitorPhone: res.data.visitorPhone,
        visitorAreas: res.data.visitAreas,
        visitorCarnum: res.data.licensePlate,
        logisticsnum: res.data.logisticsnum,
        equipment:res.data.equipment,
      });
      if (res.data.visitreason === "物流人员") {
        this.setData({
          hiddenems: true
        });
      } 
      if (res.data.visitreason === "施工人员") {
        this.setData({
          hiddeneque: true
        });
      }
    },
    fail: (error) => {
      console.error('错误：', error);
    }
  });
    
  },
})