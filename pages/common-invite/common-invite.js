Page({
  data: {
    // 其他数据...
    visitReasons: ['访客', '面试','走私','吃粑粑'], // 下拉框选项
    useCar: false,
    visitReasonIndex: 0 ,// 默认选中的选项
    dateOptions: [], // 日期选项
    selectedDate: '', // 选中的日期
    licensePlate: ['','','','','','','',''],
    current: null,
    selectedItems: [], // 用于存储选中的复选框值
  },

  checkboxChange: function (e) {
    const selectedItems = e.detail.value;
    this.setData({
      selectedItems: selectedItems,
    });
  },
  toggleUseCar: function (e) {
    this.setData({
      useCar: e.detail.value,
    });
  },

  formSubmit: function(e) {
    const formData = e.detail.value; // 获取表单提交的数据
    const dataToSubmit = this.data.selectedItems;
    const visitreason =this.data.visitReasons[this.data.visitReasonIndex];
    const arrivedate = this.data.selectedDate;
    const arrivetime=this.data.selectedTime1;
    const lefttime=this.data.selectedTime2;
    const selectedItems = this.data.selectedItems; 
    const selectedItemsString = selectedItems.join(', '); 

    formData.visitAreas = selectedItemsString;
    formData.arrivedate = arrivedate;
    formData.visitreason = visitreason;
    formData.useCar = this.data.useCar;
    formData.arrivetime = arrivetime;
    formData.lefttime = lefttime;
    const licensePlate =
      formData.licensePlate1 +
      formData.licensePlate2 +
      formData.licensePlate3 +
      formData.licensePlate4 +
      formData.licensePlate5 +
      formData.licensePlate6 +
      formData.licensePlate7 +
      formData.licensePlate8;
    formData.licensePlate = licensePlate;
    delete formData.licensePlate1;
    delete formData.licensePlate2;
    delete formData.licensePlate3;
    delete formData.licensePlate4;
    delete formData.licensePlate5;
    delete formData.licensePlate6;
    delete formData.licensePlate7;
    delete formData.licensePlate8;
  // 发送 formData 到后端 API
  console.log(formData);
  if (!formData.visitorName) {
    wx.showToast({
      title: '请输入用户名',
      icon:'error',
    });
    return; // 提前返回，避免进入下面的请求代码
  }
  if (!formData.visitorName) {
    wx.showToast({
      title: '请输入用户名',
      icon:'error',
    });
    return; // 提前返回，避免进入下面的请求代码
  }
  if(formData.useCar==true && !formData.licensePlate){
    wx.showToast({
      title: '请输入你的车牌号',
      icon:'error',
    });
    return;
  }

  if(formData.arrivetime>=formData.lefttime){
    wx.showToast({
      title: '请检查你的访问时间',
      icon:'none',
    });
    return;
  }
  if(!formData.visitorPhone||!/^\d{11}$/.test(formData.visitorPhone) ){
    wx.showToast({
      title: '请输入正确手机号码',
      icon:'none',
    })
    return;
  }
  if(!formData.idcard||!/^\d{18}$/.test(formData.idcard) ){
    wx.showToast({
      title: '请输入正确身份证号码',
      icon:'none',
    })
    return;
  }
  if(!formData.visitAreas){
    wx.showToast({
      title: '请选择访问区域',
      icon:'error'
    })
    return;
  }
    wx.request({
      url: 'http://localhost:8081/addinfo', // 替换为你的后端 API 地址
      method:"post",
      header:{
        'Content-Type': 'application/json',
      },
      data: formData,
      success: function(res) {
        console.log(res.data)
        if(res.data==="添加成功"){
        wx.showToast({
          title: '提交成功',
          icon: 'success',
          duration: 2000
        });
        wx.navigateTo({
          url: '../loading/loading?visitorphone='+formData.visitorPhone,
        })
      }
      if(res.data==="该访客存在"){
        wx.showToast({
          title: '存在一个待访问',
          icon: 'error',
          duration: 2000
        });
        return;
      }
      if(res.data==="该访客已被拉黑"){
        wx.showToast({
          title: '你以被拉黑，请联系管理员',
          icon: 'error',
          duration: 2000
        });
        return;
      }
      if(res.data==="该访客未被审核"){
        wx.showToast({
          title: '信息修改成功',
          icon: 'success',
          duration: 2000
        });
        wx.navigateTo({
          url: '../loading/loading?visitorphone='+formData.visitorPhone,
        })
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
  },
  licensePlateInput: function(e) {
    let index = e.currentTarget.dataset.index;
    let licensePlate = this.data.licensePlate;
    let previousValue = licensePlate[index];
    licensePlate[index] = e.detail.value;
    
    let current = this.data.current;
    if (e.detail.value.length < previousValue.length) {
      current = parseInt(index) - 1;
    } else if (e.detail.value.length >= 1 && index < 7) {
      current = parseInt(index) + 1;
    }
    
    this.setData({
      licensePlate: licensePlate,
      current: current
    });
  },
  
  licensePlateBlur: function(e) {
    let index = e.currentTarget.dataset.index;
    if (e.detail.value.length < this.data.licensePlate[index].length && index > 0) {
      this.setData({
        current: parseInt(index) - 1
      });
    }
  },
  
  
// 在页面加载时初始化日期选项
onLoad: function () {
  this.initDateOptions();
  this.setData({
    visitAreas: [],
  });

},

initDateOptions: function () {
  const today = new Date();
  const dateOptions = [];
  const timeOptions = [];
  for (let i = 0; i < 7; i++) {
    const date = new Date(today);
    date.setDate(today.getDate() + i);
    dateOptions.push(this.formatDate(date));
  }
  for (let i = 9; i < 18; i++) {
    const hour = i < 10 ? '0' + i : '' + i;
    for (let j = 0; j < 60; j += 60) {
      const minute = j === 0 ? '00' : '' + j;
      timeOptions.push(`${hour}:${minute}`);
    }
  }
  this.setData({
    dateOptions: dateOptions,
    timeOptions: timeOptions,
    selectedDate: dateOptions[0], // 默认选中第一个日期
    selectedTime1: timeOptions[0], // 默认选中第一个时间
    selectedTime2: timeOptions[1], // 默认选中第一个时间
  });
},

formatDate: function (date) {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  const day = date.getDate();
  return `${year}-${month < 10 ? '0' : ''}${month}-${day < 10 ? '0' : ''}${day}`;
},

datePickerChange: function (e) {
  this.setData({
    selectedDate: this.data.dateOptions[e.detail.value]
  });
},
timePickerChange1: function (e) {
  this.setData({
    selectedTime1: this.data.timeOptions[e.detail.value]
  });
},

timePickerChange2: function (e) {
  this.setData({
    selectedTime2: this.data.timeOptions[e.detail.value]
  });
},
  visitReasonChange: function (e) {
    this.setData({
      visitReasonIndex: e.detail.value
    });
  },
  
});
