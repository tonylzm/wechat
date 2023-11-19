Page({
  data: {
    currentDate: '', // 默认选择的日期
    endDate: '' ,// 30天后的日期
    inviterName: false,
    inviterPhone: false,
    inviterCompany: false,
    reason: false
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

    // 在这里添加表单验证逻辑
    if (!formData.inviterName) {
      wx.showToast({
        title: '请输入邀请人姓名',
        icon: 'none',
      });
      return;
    }

    if (!formData.inviterPhone) {
      wx.showToast({
        title: '请输入邀请人手机号',
        icon: 'none',
      });
      return;
    }

    // 其他字段的验证

    // 验证通过，可以继续提交表单或执行其他逻辑
    console.log("表单数据：", formData);
    
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
  onLoad: function() {
    const now = new Date();
    const end = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    this.setData({
      currentDate: now.toISOString().split('T')[0], // 设置默认日期
      endDate: end.toISOString().split('T')[0], // 设置30天后的日期
    });
  }
})
