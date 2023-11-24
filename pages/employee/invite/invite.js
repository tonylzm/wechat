Page({
  data: {
    currentDate: '', // 默认选择的日期
    endDate: '' ,// 30天后的日期
    inviterName: false,
    inviterPhone: false,
    inviterCompany: false,
    reason: false,
    showInfoContent: true, // 默认显示信息详情内容
    showAlertContent: false, // 默认隐藏消息提醒内容
    list: [],
    edit:'',
  },

  toggleContent: function (event) {
    const type = event.currentTarget.dataset.type;
    if (type === 'info') {
      this.setData({
        showInfoContent: true,
        showAlertContent: false,
      });
     
    } else if (type === 'alert') {
      this.setData({
        showInfoContent: false,
        showAlertContent: true,
      });
      this.loadDataFromBackend()
    }
  },
     // 当输入框获得焦点时，更改输入框的样式
  onInputFocus: function(e) {
    const inputName = e.currentTarget.dataset.input;
    const inputFocused = {};
    inputFocused[inputName] = true;
    this.setData({ inputFocused });
  },

  // 当输入框失去焦点时，还原输入框的样式
  onInputBlur: function(e) {
    const inputName = e.currentTarget.dataset.input;
    const inputFocused = {};
    inputFocused[inputName] = false;
    this.setData({ inputFocused });
  },

  // 提交表单事件处理
  submitForm: function(e) {
    const formData = e.detail.value;
    formData.edit=this.data.edit;

    // 在这里添加表单验证逻辑
    if (!formData.inviterName) {
      wx.showToast({
        title: '请输入邀请人姓名',
        icon: 'none',
      });
      return;
    }

    if (!formData.inviterPhone ||!/^\d{11}$/.test(formData.inviterPhone)) {
      wx.showToast({
        title: '请输入邀请人手机号',
        icon: 'none',
      });
      return;
    }

    // 其他字段的验证

    // 验证通过，可以继续提交表单或执行其他逻辑
    console.log("表单数据：", formData);
    wx.request({
      url: 'http://localhost:8081/invite',
      method:"POST",
      header:{
        'Content-Type': 'application/json',
      },
      data: formData,
      success: function(res) {
        console.log(res.data)
        if(res.data==="邀请成功,等待审核"){
        wx.showToast({
          title: '邀请成功',
          icon: 'success',
          duration: 2000
        });
      }
      if(res.data==="该访客已被邀请"){
        wx.showToast({
          title: '访客已经被邀请',
          icon: 'error',
          duration: 2000
        });
        return;
      }       
      },
      fail: function(err) {
        console.log('Response from Server:', res.data); // 输出后端的响应
        console.error(err);
        wx.showToast({
          title: '提交失败',
          icon: 'none',
          duration: 2000
        });
      }
    });
    
    // 在这里可以进行表单提交或跳转到下一步页面等操作
  },


// 日期选择事件处理
dateChange: function(e) {
  const selectedDate = new Date(e.detail.value); // 转换日期字符串为日期对象
  const formattedDate = `${selectedDate.getFullYear()}年${selectedDate.getMonth() + 1}月${selectedDate.getDate()}日`;
  this.setData({
    currentDate: formattedDate // 更新 currentDate 为格式化后的日期字符串
  });
},


  // 页面加载时设置默认日期和30天后的日期
  onLoad: function(options) {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    this.setData({
      currentDate: now.toISOString().split('T')[0], // 设置默认日期
      endDate: end.toISOString().split('T')[0], // 设置30天后的日期
      edit:options.username
    });
    console.log(this.data.edit)
  },

   // 自定义函数，用于向后端请求数据
   loadDataFromBackend: function (status) {
    wx.request({
      url: 'http://localhost:8081/inviteall',
      method: 'GET',
      success: (res) => {
        const rawData = res.data; // 假设后端返回的数据是一个包含多个字段的对象数组
        console.log(rawData)
        //处理响应数据，只保留所需的字段
        const processedData = rawData.map(item => ({
          name: item.inviterName,
          content: item.inviterPhone,
          applicationStatus: item.status,
        }));
       this.setData({
          list: processedData,
        });
      },
      fail: (error) => {
        console.error('请求失败:', error);
      },
    });
  },
  
  onPullDownRefresh: function () {
    // 重新加载数据，根据当前选定状态重新加载
    const currentStatus = 'all'; // 默认为显示所有数据
    this.loadDataFromBackend(currentStatus);
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
  },
  
  click: function (e) {
    const status = e.currentTarget.dataset.status; // 获取点击的文本元素的 status 属性值
    if (status) {
      this.loadDataFromBackend(status);     
    } else{
      const id = e.currentTarget.id;     
      const content = this.data.list[id].content;
      const application=this.data.list[id].applicationStatus;
      console.log(application);
      // 点击列表项，导航到目标页面并传递参数
      console.log("按了：", id);
      wx.navigateTo({
        url: '../../../info/pages/inviteAudit/inviteAudit?content=' + content+'&edit='+this.data.edit,
      });
    }
  },
})
