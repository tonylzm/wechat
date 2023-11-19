// pages/Audit/Audit.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    visitorName: '',  // 初始化为空
    visitorCompany:'',
    visitorReason:'',
    visitorPerson:'',
    visitorPhone:'',
    visitorAreas:'',
    visitorCarnum:'',
    equipment:'',
    status:'',
    hiddenems: false, // 设置为布尔值 true
    hiddeneque:false,
    hibutton: true, // 初始化为false，表示隐藏
    edit:'',
    lockinfo:'',
  },

  onLoad(options) {
    console.log(options);
      // 模拟从后端获取数
    this.setData({
      edit:options.edit,
      lockinfo:options.lockinfo,
    })
    const content = options.content;
      
  // 发送数据到后端
  wx.request({
    url: 'http://localhost:8081/findinfo',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      visitorPhone: content
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
        status:res.data.applicationStatus,  
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
      if(res.data.applicationStatus != null){
        this.setData({
          hibutton: false,
        });
      }
    },
    fail: (error) => {
      console.error('错误：', error);
    }
  });
    
  },

  onApprove: function (event) {
    // 在这里编写“同意”按钮的事件处理代码
    const content = this.data.visitorPhone;
    console.log(content);
    wx.request({
      url: 'http://localhost:8081/vet',
      method: 'get',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      visitorPhone: content,
      edit:this.data.edit,
    },
    success: (res) => {
      if(res.data=="审核成功"){
      wx.showToast({
        title: '审批通过',
      })
    }else{
      wx.showToast({
        title: '权限不足',
        icon:'error'
      })
    }
      setTimeout(() => {
        // 在这里执行下一个操作
        wx.navigateBack({
          delta: 1, // 返回的页面层数，通常为1表示返回上一个页面
          })
      }, 1000);
    },
    fail: (error) => {
      wx.showToast({
        title: '失败',
      })
      console.error('错误：', error);
    }
   

    })
    console.log("点击了同意按钮");
  },

  onRefuse: function (event) {
    // 在这里编写“拒绝”按钮的事件处理代码
    const content = this.data.visitorPhone;
    wx.request({
      url: 'http://localhost:8081/refuse',
      method: 'get',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      visitorPhone: content,
      edit:this.data.edit,
    },
    success: (res) => {
      console.log(res.data)
      if(res.data=="拒绝成功"){
      wx.showToast({
        title: '已拒绝',
      })
    }else{
      wx.showToast({
        title: '权限不足',
        icon:'error'
      })
    }
      setTimeout(() => {
        // 在这里执行下一个操作
        wx.navigateBack({
          delta: 1, // 返回的页面层数，通常为1表示返回上一个页面
          })
      }, 1000);
    },
    fail: (error) => {
      wx.showToast({
        title: '失败',
      })
      console.error('错误：', error);
    }
  
    })
    console.log("点击了拒绝按钮");
  },

  onBlock: function (event) {
    // 在这里编写“拉黑”按钮的事件处理代码
    const content = this.data.visitorPhone;
    const visitorName=this.data. visitorName;
    const affiliatedUnit=this.data.visitorCompany;
    function getCurrentFormattedTime() {
      const currentDate = new Date();
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth() + 1;
      const day = currentDate.getDate();
      const hours = currentDate.getHours();
      const minutes = currentDate.getMinutes();
      const seconds = currentDate.getSeconds();
  
      return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  } 
  const blocktime = getCurrentFormattedTime();
    console.log(content);
    wx.request({
      url: 'http://localhost:8081/block',
      method: 'post',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      visitorPhone: content,
      visitorName:visitorName,
      affiliatedUnit:affiliatedUnit,
      blocktime:blocktime
    },
    success: (res) => {
      wx.showToast({
        title: '已拉黑',
      })
      setTimeout(() => {
        // 在这里执行下一个操作
        wx.navigateBack({
          delta: 1, // 返回的页面层数，通常为1表示返回上一个页面
          })
      }, 1000);
    },
    fail: (error) => {
      wx.showToast({
        title: '失败',
      })
      console.error('错误：', error);
    }
  
    })

    console.log("点击了拉黑按钮");
  },


  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage() {

  }
})