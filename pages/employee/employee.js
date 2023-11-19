let username,password
Page({
  getusername(event){
    username=event.detail.value
  },
  getpassword(event){
    password=event.detail.value
  },
 
  submit(){
    let that=this
    wx.request({
      url: 'http://localhost:8081/loginstaff',
      method:"get",
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      data:{
        StaffIdcard:username,
        StaffPassword:password,
      },
      success(res){
        console.log("成功",res)
        that.setData({result:res.data})
        if(res.data=="登录成功"){
          wx.showToast({
            title: '登录成功'
          })
          wx.redirectTo({
            url: './home/home?username='+username,
          })
          }else{
            wx.showToast({
              icon:"none",
              title: '登录失败',
            })
          }
        },
     
      fail(res){
        console.log("失败",res)
      }
    })
  },
})