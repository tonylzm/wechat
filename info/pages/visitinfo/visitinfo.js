// info/pages/visitinfo/visitinfo.js
Page({
  data: {
    list: [],
    edit:'',
    selectedStatus: '即将到访',
  },
  onLoad: function (options) {
    // 在页面加载时发送请求并更新 list
    this.setData({
      edit:options.username
    })
    this.loadDataFromBackend('即将到访');
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
          '正在访问': item => baseFilter(item) && item.uuid !== null && item.uuid !== "000000000000000000000000",
          '已访问': item => baseFilter(item) && item.uuid === "000000000000000000000000",
          '即将到访': item => baseFilter(item) && item.uuid === null,
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
  
  onPullDownRefresh: function () {
    // 重新加载数据，根据当前选定状态重新加载
    const currentStatus = 'all'; // 默认为显示所有数据
    this.loadDataFromBackend(currentStatus);
    wx.stopPullDownRefresh(); // 停止下拉刷新动画
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
        url: '/pages/Audit/Audit?content=' + content +'&lockinfo='+ lockinfo +'&edit='+this.data.edit,
    });
         
    }
},
});
