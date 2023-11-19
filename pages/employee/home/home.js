// pages/employee/home/home.js
Page({
  data: {
    images: [
      '../../images/1.png',
      '../../images/2.png',
      '../../images/3.png',
    ],
    username:"",
   
  },
onLoad(options){
  this.data.username=options.username;
  console.log(this.data.username)
},
  navigateToManage: function() {
    wx.navigateTo({
      url: '/pages/employee/home/home',
    });
  },

  navigateToQRCode: function() {
    wx.navigateTo({
      url: '/pages/employee/qrcode/qrcode?StaffIdcard='+ this.data.username,
    });
  },

  navigateToProfile: function() {
    wx.navigateTo({
      url: '/pages/employee/profile/profile?id='+ this.data.username,
    });
  },

  redirectToPage: function(event) {
    // 获取点击图片的目标页面路径
    const targetUrl = event.currentTarget.dataset.url+"?username="+this.data.username;
    console.log(targetUrl)
    // 使用 redirectTo 跳转到目标页面（或使用 navigateTo，取决于你的需求）
    wx.navigateTo({
      url: targetUrl
    });
  },
});
