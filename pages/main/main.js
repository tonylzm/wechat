let id,name,age,gender
Page({
  getId(event){
    id=event.detail.value
    console.log(event.detail.value)
  },
  getName(event){
    name=event.detail.value
    console.log(event.detail.value)
  },
  getAge(event){
    age=event.detail.value
    console.log(event.detail.value)
  },
  getGender(event){
    gender=event.detail.value
    console.log(event.detail.value)
  },




  add(){
    console.log(id,name,age,gender)
    let that=this
    wx.request({
      url: 'http://localhost:8081/add',
      method:"get",
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      data:{
        id:id,
        name:name,
        age:age,
        gender:gender
      },
      success(res){
        console.log("成功",res)
        that.setData({result:res.data})
        if(res.data.statusCode==200){
          wx.showToast({
            title: '添加成功'
          })
          }else{
            wx.showToast({
              icon:"none",
              title: '添加失败',
            })
          }
        },
     
      fail(res){
        console.log("失败",res)
      }
    })
  },




  delete(){
    if(id){
wx.request({
  url: 'http://localhost:8081/deleteone',
  method:"get",
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      data:{
        id:id
      },
      success(res){
        console.log("删除成功",res)
        if(res.data.statusCode==200){
          wx.showToast({
            title: '删除成功',
          })
        }else{
          wx.showToast({
            icon:"none",
            title: '删除失败',
          })
        }
      },
      fail(res){
        console.log("删除失败",res)
      }
})
    }else{
      wx.showToast({
        icon:"none",
        title: '请输入id',
      })
    }
  },
  update(){
    console.log(id,name,age,gender)
    let that=this
    wx.request({
      url: 'http://localhost:8081/add',
      method:"get",
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      data:{
        id:id,
        name:name,
        age:age,
        gender:gender
      },
      success(res){
        console.log("成功",res)
        that.setData({result:res.data})
        if(res.data.statusCode==200){
          wx.showToast({
            title: '修改成功'
          })
          }else{
            wx.showToast({
              icon:"none",
              title: '修改失败',
            })
          }
        },
     
      fail(res){
        console.log("失败",res)
      }
    })
  },
  getall(){
    let that=this
    wx.request({
      url: 'http://localhost:8081/getAll',
      method:"get",
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      success(res){
        console.log("查询成功",res)
        if(res.data.statusCode==200){
          that.setData({datalist:res.data})
        }
        else{
          wx.showToast({
            icon:"none",
            title: '查询失败',
            
          })
          that.setData({datalist:res.data})
        }
      },
      fail(res){
        console.log("查询失败",res)
      },
})}
})