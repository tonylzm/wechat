// info/pages/visitinfo/visitinfo.js
Page({
  data: {
    list: [],
    edit:'',
    selectedStatus: '正在访问',
  },
  onLoad: function (options) {
    // 在页面加载时发送请求并更新 list
    this.setData({
      edit:options.username
    })
    this.loadDataFromBackend('正在访问');
  },
  // 自定义函数，用于向后端请求数据
  loadDataFromBackend: function (status) {
    wx.request({
      url: 'http://localhost:8081/allinfo',
      method: 'GET',
      success: (res) => {
        const rawData = res.data;
        const processedData = rawData.map(item => ({
          name: item.visitorName,
          content: item.visitorPhone,
          applicationStatus: item.applicationStatus,
          lockinfo: item.lockinfo,
          uuid:item.uuid
        }));
        // 根据参数值筛选数据
        let baseFilter = item => item.applicationStatus === "通过";
        let filteredData;
        const statusFilters = {
          '正在访问': item => baseFilter(item) && item.uuid !== null,
        };
        filteredData = processedData.filter(item => statusFilters[status](item));
       this.setData({
          list: filteredData,
        });
      },
      fail: (error) => {
        console.error('请求失败:', error);
      },
    });
  },
  
  click: function (e) {
    const status = e.currentTarget.dataset.status; // 获取点击的文本元素的 status 属性值
    this.setData({
      selectedStatus: status,
    });
    if (status) {
      this.loadDataFromBackend(status);     
    } else{
      const id = e.currentTarget.id;     
      const content = this.data.list[id].content;
      const lockinfo=this.data.list[id].lockinfo;
      
      // 点击列表项，导航到目标页面并传递参数
     wx.navigateTo({
        url: '../sendtoinfo/sendtoinfo?content=' + content +'&lockinfo='+ lockinfo +'&edit='+this.data.edit,
    });
         
    }
},
});
