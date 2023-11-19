// pages/employee/home/home.js
Page({
  data: {
    visitorName: '',  // 初始化为空
    visitorCompany:'',
    visitorReason:'',
    visitorPerson:'',
    visitorPhone:'',
    visitorAreas:'',
    visitorCarnum:'',
    time:'',
    images: [
      '../images/1.png',
      '../images/2.png',
      '../images/3.png',
    ]
  },

  navigateToManage: function() {
    wx.navigateTo({
      url: '/pages/employee/home/home',
    });
  },

  navigateToQRCode: function() {
    wx.navigateTo({
      url: `../common-login/common-qrcode/common-qrcode?visitPhone=${this.data.visitorPhone}&time=${this.data.time}`,
    });
  },

  navigateToProfile: function() {
    wx.navigateTo({
      url: '../common-login/common-profile/common-profile?visitPhone=' + this.data.visitorPhone,
    });
  },
  onLoad: function (options) {
    // 模拟从后端获取数据
    console.log(options.visitPhone)
    const visitPhone=options.visitPhone;
    wx.request({
      url: 'http://localhost:8081/findinfo',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        visitorPhone: visitPhone
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
          time:res.data.arrivetime+"-"+res.data.lefttime,
        });
      },
      fail: (error) => {
        console.error('错误：', error);
      }
    });     
  }
});
