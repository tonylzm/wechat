Page({
  data: {
    list: [],
    edit:'',
  },

  onLoad: function (options) {
    // 在页面加载时发送请求并更新 list
    this.setData({
      edit:options.username
    })
    this.loadDataFromBackend('all');
  },

  // 自定义函数，用于向后端请求数据
  loadDataFromBackend: function (status) {
    wx.request({
      url: 'http://localhost:8081/allinfo',
      method: 'GET',
      success: (res) => {
        const rawData = res.data; // 假设后端返回的数据是一个包含多个字段的对象数组
        console.log(rawData)
        // 处理响应数据，只保留所需的字段
        const processedData = rawData.map(item => ({
          name: item.visitorName,
          content: item.visitorPhone,
          applicationStatus: item.applicationStatus,
          lockinfo: item.lockinfo,
        }));
        // 在这里根据参数值设置不同的图片URL
        processedData.forEach(item => {
          switch (item.applicationStatus) {
            case '通过':
              item.url = '../images/16.jpg'; // 设置通过的图片URL
              break;
            case '拒绝':
              item.url = '../images/15.png'; // 设置拒绝的图片URL
              break;
            case '拉黑':
              item.url = '../images/17.png'; // 设置拉黑的图片URL
              break;
            default:
              item.url = '../images/18.jpg'; // 设置其他情况的图片URL
          }
        });
        // 根据参数值筛选数据
        let filteredData;
        switch(status){
          case 'all':
            filteredData = processedData; // 显示所有数据
            break;
          case '已审核':
            filteredData = processedData.filter(item => item.applicationStatus !=null);
            break;
          case '黑名单':
            filteredData = processedData.filter(item => item.applicationStatus ==="拉黑");
            break;
          case '未审核':
            filteredData = processedData.filter(item => item.applicationStatus ===null || item.applicationStatus === "");
            break;
        }      
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
    if (status) {
      this.loadDataFromBackend(status);     
    } else{
      const id = e.currentTarget.id;     
      const content = this.data.list[id].content;
      const application=this.data.list[id].applicationStatus;
      const lockinfo=this.data.list[id].lockinfo;
      console.log(application);
      // 点击列表项，导航到目标页面并传递参数
        console.log("按了：", id);
        switch(application){
          case "拉黑":
            wx.navigateTo({
              url: '/pages/block-manage/block-manage?content=' + content+'&edit='+this.data.edit,
          });
          break;
          default:
            wx.navigateTo({
              url: '/pages/Audit/Audit?content=' + content +'&lockinfo='+ lockinfo +'&edit='+this.data.edit,
          });
          break;
        
        }
    }
},
});
