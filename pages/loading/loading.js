// pages/loading/loading.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    text1: '审核中，大概需要10分钟...',
    image1: '../images/19.jpg',
    visitorPhone:'',
    showview:false,
    showview1:false,
    showview2:false,
  },
  onPullDownRefresh: function () {
    // 清除定时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    // 执行数据刷新操作
    this.sendRequestToBackend(this.data.visitorPhone);
    // 数据刷新后调用wx.stopPullDownRefresh停止下拉刷新
    wx.stopPullDownRefresh();
  },
  onLoad: function (options) {
    // 首次执行查询
    const visitorphone = options.visitorphone;
    this.data.visitorPhone=visitorphone;
    console.log(visitorphone);
    this.sendRequestToBackend(visitorphone);
    // 每隔一段时间重新执行查询
    this.intervalId = setInterval(() => {
      this.sendRequestToBackend(visitorphone);
    }, 60000); // 60秒，单位为毫秒
  },

  onUnload: function () {
    // 清除定时器，以防页面卸载时仍然执行
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },

  sendRequestToBackend: function (visitorphone) {
    // 发送请求到后端，你需要根据你的后端接口来实现这部分逻辑
    wx.request({
      url: 'http://localhost:8081/status', // 后端接口地址
      method: 'GET', // 请求方法，可以根据实际情况修改
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        visitorPhone: visitorphone
      },
      success: (res) => {
        // 处理后端返回的数据
        console.log('后端返回的数据：', res.data);
        // 在这里更新页面的数据
        switch(res.data){
          case "通过":
            this.setData({
              text1: '审核已完成，结果为：' + res.data,
              image1: '../images/20.jpg',
              showview:true,
              showview1:false,
              showview2:false,   
            });
            if (this.intervalId) {
              clearInterval(this.intervalId);
            };
            break;
            case "已访问":
              this.setData({
                text1: '你已访问，进入个人中心',
                image1: '../images/20.jpg',
                showview:true,
                showview1:false,
                showview2:false,   
              });
              if (this.intervalId) {
                clearInterval(this.intervalId);
              };
              break;
          case "拒绝":
            this.setData({
              text1: '审核已完成，结果为：' + res.data,
              image1: '../images/21.png',
              showview:false,
              showview1:true,
              showview2:false,
            });
            if (this.intervalId) {
              clearInterval(this.intervalId);
            };
            break;
          case '不存在':
            this.setData({
              text1: '您近期没有在进行的申请',
              image1: '../images/21.png',
              showview:false,
              showview1:true,
              showview2:false,
            });
            if (this.intervalId) {
              clearInterval(this.intervalId);
            };
            break;
          default:
            this.setData({
              text1: '审核中，大概需要10分钟...',
              image1: '../images/19.jpg',
              showview:false,
              showview1:false,
              showview2:true,
            });
            break;
        }      
      },
      fail: (error) => {
        console.error('请求后端失败：', error);
      },
    });
  },


  goprofile: function() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    wx.reLaunch({
      url: '/pages/common-login/common-login?visitPhone=' + this.data.visitorPhone,
    });
  },
  back:function(){
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    wx.navigateTo({
      url: "../../invite/pages/check/check",
    });
  },
  home:function(){
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
    wx.navigateTo({
      url: "../firstpg/firstpg",
    });
  }
  
});
