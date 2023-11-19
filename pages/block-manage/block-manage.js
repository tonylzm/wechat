// pages/Audit/Audit.js
Page({
  /**
   * 页面的初始数据
   */
  data: {
    visitorName: '',  // 初始化为空
    visitorCompany:'',
    blockReason:'',
    blockPerson:'',
    blockTime:'',
    visitorPhone:'',
    edit:''
  },
  onBlockReasonInput: function (e) {
    // 当用户输入时，将输入的数据存储在blockReason数据属性中
    this.setData({
      Reason: e.detail.value
    });
  },

  onPullDownRefresh: function () {
    // 重新加载数据，根据当前选定状态重新加载  
    this.onLoad(() => {
      // 数据获取成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    });
  },

  onLoad(options) { 
    const content = options.content;
    // 在页面加载时和下拉刷新时都加载数据
    this.loadDataFromBackend(content);
    this.setData({
      edit:options.edit,
    })
  },

  onPullDownRefresh: function () {
    // 执行数据刷新操作
    this.loadDataFromBackend(this.data.visitorPhone, () => {
      // 数据检索成功后，停止下拉刷新
      wx.stopPullDownRefresh();
    });
  },

  // 提取的加载数据函数
  loadDataFromBackend(content, callback) {
    wx.request({
      url: 'http://localhost:8081/blockinfo',
      method: 'GET',
      header: {
        'Content-Type': 'application/json',
      },
      data: {
        visitorPhone: content,
        
      },
      success: (res) => {
        // 使用新数据更新数据属性
        this.setData({
          visitorName: res.data.visitorName || '',
          visitorCompany: res.data.affiliatedUnit || '',
          blockReason: res.data.blockreason || '',
          blockPerson: res.data.blockpeople || '',
          blockTime: res.data.blocktime || '',
          visitorPhone: res.data.visitorPhone || '',
        });
        if (callback) {
          callback(); // 调用回调函数停止下拉刷新
        }
      },
      fail: (error) => {
        console.error('错误：', error);
        if (callback) {
          callback(); // 调用回调函数停止下拉刷新
        }
      }
    });
  },

  onRem: function (event) {
    // 在这里编写“同意”按钮的事件处理代码
    const content = this.data.visitorPhone;
    console.log(content);
    wx.request({
      url: 'http://localhost:8081/removeblock',
      method: 'get',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      visitorPhone: content     
    },
    success: (res) => {
      wx.showToast({
        title: '移除成功',
        
      })
      wx.navigateTo({
        url: '../application/application',
      })
    },
    fail: (error) => {
      wx.showToast({
        title: '失败',
      })
      console.error('错误：', error);
    }
    })
  },

  onSubre: function (event) {
    const content = this.data.visitorPhone;
    const blockReason=this.data.Reason;
    console.log(blockReason);
    wx.request({
      url: 'http://localhost:8081/addreason',
      method: 'post',
    header: {
      'Content-Type': 'application/json',
    },
    data: {
      visitorPhone: content,
      blockreason:blockReason,
      blockpeople:this.data.edit,
    },
    success: (res) => {
      wx.showToast({
        title: '已提交',
      })
    },
    fail: (error) => {
      wx.showToast({
        title: '失败',
      })
      console.error('错误：', error);
    }  
    })
  },

})