Page({
  data: {
    showInfoContent: true, // 默认显示信息详情内容
    showAlertContent: false, // 默认隐藏消息提醒内容
    showHistoryContent:false,
    visitorName:'',
    affiliatedUnit:'',
    idcard:'',
    visitorPhone:'',
    text:'',
    infoQueryTriggered: false, // 添加一个标志
    list: [],
    currentPage: 0, // 当前页数，默认为0
    pageSize: 8, // 每页显示的数据条数
    range:[4,6,8],
  },

  // 点击text元素时切换内容的显示状态
  toggleContent: function (event) {
    const type = event.currentTarget.dataset.type;
    if (type === 'info') {
      this.setData({
        showInfoContent: true,
        showAlertContent: false,
        showHistoryContent:false,
      });
       // 在点击"info"选项时触发查询操作，仅当标志为false时触发
       if (!this.data.infoQueryTriggered) {
        this.queryInfoData();
        this.setData({ infoQueryTriggered: true });
      }
    } else if (type === 'alert') {
      this.setData({
        showInfoContent: false,
        showAlertContent: true,
        showHistoryContent:false,
      });
      this.loadinfo();
    }else if(type === 'history'){
      this.setData({
        showInfoContent: false,
        showAlertContent: false,
        showHistoryContent: true,
      });
      this.loadDataFromBackend();
    }
  },

  onLoad: function (options) {
    console.log('接收到的参数是：', options.visitPhone);
   
    const totalPageCount = Math.ceil(this.data.list.length / this.data.pageSize);
  const pageRange = Array.from({ length: totalPageCount }, (_, i) => `${i + 1}`);
  this.setData({
    pageRange: pageRange,
    visitorPhone:options.visitPhone
  });
    // 模拟点击"info"选项以触发查询操作
    this.toggleContent({ currentTarget: { dataset: { type: 'info' } } });
  },

  queryInfoData: function () {
    const visitPhone=this.data.visitorPhone;
    wx.request({
      url: 'http://localhost:8081/findinfo',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        visitorPhone: visitPhone
      },
      success: (res) => {
        // 使用从后端接收的数据更新前端数据属性
        console.log(res.data)
        this.setData({
          visitorName: res.data.visitorName,
          affiliatedUnit: res.data.affiliatedUnit,
          visitorPhone: res.data.visitorPhone,
          idcard: res.data.idcard,    
          text: res.data.visitorPhone,
        });
      },
      fail: (error) => {
        console.error('错误：', error);
      }
    });   
  },
   // 自定义函数，用于向后端请求数据
   loadDataFromBackend: function () {
    wx.request({
      url: 'http://localhost:8081/history',
      method: 'GET',
      data:{
        page:this.data.currentPage,
        pageSize:this.data.pageSize,
        visitorPhone:this.data.visitorPhone
      },
      success: (res) => {
        const rawData = res.data.content; // 假设后端返回的数据是一个包含多个字段的对象数组
        console.log(rawData)
        const processedData = rawData.map(item => ({
          name: item.visitorName,
          content: item.uuid,
          applicationStatus: item.applicationStatus,
          uuid:item.uuid,
        }));
        // 在这里根据参数值设置不同的图片URL
        processedData.forEach(item => {
          switch (item.applicationStatus) {
            case '通过':
              item.url = '../../images/16.jpg'; // 设置通过的图片URL
              break;
            case '拒绝':
              item.url = '../../images/15.png'; // 设置拒绝的图片URL
              break;
            case '拉黑':
              item.url = '../../images/17.png'; // 设置拉黑的图片URL
              break;
            default:
              item.url = '../../images/18.jpg'; // 设置其他情况的图片URL
          }
        });  
       this.setData({
          list:  processedData,
        });
      },
      fail: (error) => {
        console.error('请求失败:', error);
      },
    });
  },
  loadinfo: function () {
    wx.request({
      url: 'http://localhost:8081/getsub',
      method: 'GET',
      data:{
        page:this.data.currentPage,
        pageSize:this.data.pageSize,
        visitPhone:this.data.visitorPhone
      },
      success: (res) => {
        const rawData = res.data.content; // 假设后端返回的数据是一个包含多个字段的对象数组
        console.log(rawData)
        const processedData = rawData.map(item => ({
          name: item.title,
          content: item.time,
          substance:item.substance,
           
        }));
        // 在这里根据参数值设置不同的图片URL
       this.setData({
          list:  processedData,
        });
      },
      fail: (error) => {
        console.error('请求失败:', error);
      },
    });
  },
incrementPage: function () {
    this.setData({
      currentPage: this.data.currentPage + 1,
    });
    this.loadDataFromBackend();
  
},
decrementPage: function () {
  // 减少页数
  if (this.data.currentPage > 0) {
    this.setData({
      currentPage: this.data.currentPage - 1,
    });
    this.loadDataFromBackend();
  }
},
changePageSize: function (e) {
  const selectedValue = e.detail.value;
  this.setData({
    pageSize: this.data.range[selectedValue],
  });
  this.loadDataFromBackend();
},

click: function (e) {
  const status = e.currentTarget.dataset.status; // 获取点击的文本元素的 status 属性值
  if (status) {
    this.loadDataFromBackend(status); 
        
  } else{
    const id = e.currentTarget.id;     
    // const content = this.data.list[id].content;
    const uuid=this.data.list[id].uuid;
    const application=this.data.list[id].applicationStatus;
    console.log(application);
    // 点击列表项，导航到目标页面并传递参数
      console.log("按了：", id);
    wx.navigateTo({
        url: '../../../invite/pages/detailed-info/detailed-info?uuid=' + uuid,
    });
       
  }
},
clickinfo: function (e) {
  const status = e.currentTarget.dataset.status; // 获取点击的文本元素的 status 属性值
  if (status) {
    this.loadDataFromBackend(status); 
        
  } else{
    const id = e.currentTarget.id;     
    // const content = this.data.list[id].content;
    const uuid=this.data.list[id].uuid;
    const substance=this.data.list[id].substance;
    console.log("按了：", id);
    wx.navigateTo({
        url: '../../../info/pages/showinfo/showinfo?substance='+substance,
    });
       
  }
},
});
