// info/pages/inviteAudit/inviteAudit.js
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
    hibutton: false, // 初始化为false，表示隐藏
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
    url: 'http://localhost:8081/inviteinfo',
    method: 'GET',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      inviterPhone: content
    },
    success: (res) => {
      // 使用从后端接收的数据更新前端数据属性
      console.log(res.data)
      this.setData({
        visitorName: res.data.inviterName,
        visitorCompany: res.data.inviterCompany,
        visitorPerson: res.data.edit,
        visitorPhone: res.data.inviterPhone,
        visitorReason: res.data.reason,
        status:res.data.status,  
        visitorTime:res.data.visitDate,
      });
      
      if(res.data.status == "未处理"){
        this.setData({
          hibutton: true,
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
      url: 'http://localhost:8081/invitevet',
      method: 'get',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      inviterPhone: content,
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
      url: 'http://localhost:8081/inviterefuse',
      method: 'get',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      inviterPhone: content,
      edit:this.data.edit,
    },
    success: (res) => {
      console.log(res.data)
      if(res.data=="审核成功"){
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