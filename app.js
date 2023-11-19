// app.js
const app = getApp()
App({
  onLaunch() {
    // 展示本地存储能力
    // 登录
    wx.login({
      success:function(res){
        if(res.code){
            console.log(res.code);
        }
    }
    });
  },
  globalData: {
    userInfo: null
  },
})
