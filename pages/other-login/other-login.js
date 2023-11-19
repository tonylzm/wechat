// pages/other-login/other-login.js
Page({

  /**
   * 页面的初始数据
   */
  data: {

  },

  submit: function (e) {
    const formData = e.detail.value;
    const phoneNumber = formData.phoneNumber;
    console.log('手机号：' + phoneNumber);
    // 可以在这里进行其他处理，如发送请求等
    if(!formData.phoneNumber||!/^\d{11}$/.test(formData.phoneNumber)){
      wx.showToast({
        title: '请输入正确的手机号',
        icon:"error"
      })
      return;
    }
    wx.navigateTo({
      url: '../loading/loading?visitorphone='+ phoneNumber,
    })
  },
  


  /**
   * 生命周期函数--监听页面加载
   */
  onLoad(options) {

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