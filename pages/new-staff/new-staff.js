// pages/new-staff/new-staff.js
Page({
  data: {
    // 其他数据...
    staffPosition: ['普通员工', '部门经理','业务经理'], // 下拉框选项
    staffPositionIndex: 0 ,// 默认选中的选项
  },

 
  formSubmit: function(e) {
    const formData = e.detail.value; // 获取表单提交的数据
    const  staffPosition =this.data.staffPosition[this.data. staffPositionIndex];
    const staffPassword = formData.staffIdcard;
    formData.staffPosition = staffPosition;
    formData.staffPassword=staffPassword;
   console.log(formData);

   if (!formData.staffName) {
    wx.showToast({
      title: '请输入员工姓名',
      icon: 'none',
    });
    return;
  }
  if (!formData.staffPhone || !/^\d{11}$/.test(formData.staffPhone)) {
    wx.showToast({
      title: '请输入11位有效的电话号码',
      icon: 'none',
    });
    return;
  }
  if (!formData.staffIdcard) {
    wx.showToast({
      title: '请输入员工工号',
      icon: 'none',
    });
    return;
  }

  if (!formData.staffAffiliatedUnit) {
    wx.showToast({
      title: '请输入员工所属单位',
      icon: 'none',
    });
    return;;
  }
    wx.request({
      url: 'http://localhost:8081/addstaff', // 替换为你的后端 API 地址
      method:"post",
      header:{
        'Content-Type': 'application/json',
      },
      
      data: formData,
      success: function(res) {
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
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
  },
 
  staffPositionChange: function (e) {
    this.setData({
      staffPositionIndex: e.detail.value
    });
  },
  
});
