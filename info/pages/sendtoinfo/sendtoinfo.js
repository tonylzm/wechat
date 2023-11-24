// info/pages/sendtoinfo/sendtoinfo.js
Page({
  data: {
      msgValue: '',
      title:'',
      content: '',
      edit:'',
  },
  bindTextAreaBlur: function(e) {
      this.setData({
          msgValue: e.detail.value
      })
  },
  bindText: function(e) {
    this.setData({
       title: e.detail.value
    })
},
  submitForm: function() {
      console.log('消息内容：', this.data.msgValue);
      function getCurrentFormattedTime() {
        const currentDate = new Date();
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth() + 1;
        const day = currentDate.getDate();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        return `${year}-${month}-${day} ${hours}:${minutes}`;
    }
    const blocktime = getCurrentFormattedTime();
      wx.request({
        url: 'http://localhost:8081/addsub',
        method:'POST',
        data:{
          visitPhone:this.data.content,
          edit:this.data.edit,
          substance:this.data.msgValue,
          title:this.data.title,
          time:blocktime,
        },
        success: (res) => {
          wx.showToast({
              title: '发送成功',
              icon:"success"
          })
          setTimeout(function() {
              wx.navigateTo({
                  url: '../sendinfo/sendinfo',
              })
          }, 1000);
      },
        fail: (error) => {
         wx.showToast({
           title: '发送失败',
           icon:'error'
         })
        },
      });
      
  },
  resetForm: function() {
      this.setData({
          msgValue: '',
          title:''
      })
  },
  onLoad: function (options) {
    console.log(options)
    this.setData({
      content:options.content,
      edit:options.edit
    })
    
  }
})
