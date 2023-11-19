const { relativeTimeThreshold } = require("moment");

// invite/pages/power/power.js
Page({
  data: {
    questList: [{
      questions: '管理部',
      list: [],
      t: false,
    }, {
      questions: '市场部',
      list: [], 
      t: false,
    }, {
      questions: '行政部',
      list: [], 
      t: false,
    }],
    checkboxItems: [
      { value: "仓库", checked: false },
      { value: "办公大楼", checked: false },
      // 添加其他复选框项...
    ],
    checkboxItems1: [
      { value: "施工", checked: false },
      { value: "物流", checked: false },
      // 添加其他复选框项...
    ],
    showIndex: -1,
    processedData:[],
    infoQueryTriggered:false,
    index:'',
    username:'',

    mainpower: '',//存储管控地点文件
    secondarypower:'',//存储管控事由文件
    start:'',//存储开始时间文件
    end:'',//存储结束时间文件


    board:'成龙',
    ceo:'成龙',
    staff:false,
    contorl:false,
  },

  matchMainpower: function () {
    const mainpower = this.data.mainpower;
    const checkboxItems = this.data.checkboxItems;
    checkboxItems.forEach((checkboxItem) => {
      if (mainpower.includes(checkboxItem.value)) {
        checkboxItem.checked = true;
      }
    });
    // 更新页面数据
    this.setData({
      checkboxItems: checkboxItems,
    });
  },
  matchsecondarypower: function () {
    const secondarypower = this.data.secondarypower;
    const checkboxItems1 = this.data.checkboxItems1;
    checkboxItems1.forEach((checkboxItem) => {
      if (secondarypower.includes(checkboxItem.value)) {
        checkboxItem.checked = true;
      }
    });
    // 更新页面数据
    this.setData({
      checkboxItems1: checkboxItems1,
    });
  },
//第一个复选框选中函数
  checkboxChange: function (e) {
    const selectedItems = e.detail.value;
    const mainpower = selectedItems.join(",");
    this.setData({
      mainpower: mainpower,
    });
  },
  //第二个复选框选中函数
  checkboxChange1: function (e) {
    const selectedItems = e.detail.value;
    const secondarypower = selectedItems.join(",");
    this.setData({
      secondarypower: secondarypower,
    });
  },
//时间选中函数
  onPickerChange(e) {//返回回调函数
    if(e.currentTarget.id=="start"){
      this.data.start=e.detail.value;
    }else{
      this.data.end=e.detail.value;
    }
},

  toggleContent: function (event) {
    const type = event.currentTarget.dataset.type;
    if (type === 'staff') {
      this.setData({
        staff:true,
        contorl:false,
      }); 
    } else if (type === 'inside') {
      this.setData({
        staff:false,
        contorl:true,
      });
    }
  },

  panel: function (e) {
    const index = e.currentTarget.dataset.index; // 获取当前折叠面板的索引
      // 收缩其他折叠面板，并更新索引
      this.data.questList.forEach((item, i) => {
        if (i !== index) {
          this.setData({
            [`questList[${i}].t`]: false,
          });
        }
      });
    // 根据折叠面板的数据发送对应的请求获取数据，这里是一个示例，具体请求方法请根据实际情况替换
    const processedData= this.data.processedData;
        // 根据索引将数据存储在对应的list数组中
       processedData.forEach(item => {
        if(item.content=="人事部"){
          const filteredData = processedData.filter(item => item.content=="人事部");
        this.setData({
          [`questList[${0}].list`]: filteredData, // 更新对应折叠面板的数据
          showIndex: index, // 更新显示的折叠面板索引
        });
      }
      if(item.content=="市场部"){
        const filteredData = processedData.filter(item => item.content=="市场部");
        this.setData({
          [`questList[${1}].list`]: filteredData, // 更新对应折叠面板的数据
          [`questList[${index}].t`]: !this.data.questList[index].t, // 切换折叠状态
          showIndex: index, // 更新显示的折叠面板索引
        });
      }
      if(item.content=="行政部"){
        const filteredData = processedData.filter(item => item.content=="行政部");
        this.setData({
          [`questList[${2}].list`]: filteredData, // 更新对应折叠面板的数据
          showIndex: index, // 更新显示的折叠面板索引
        });
      }

    })
      
  },

fetchdata:function(){
  wx.request({
    url: 'http://localhost:8081/allstaff',
    method: 'GET',
    success: (res) => {
      const newData = res.data; // 假设后端返回的数据在 res.data 中
      console.log(newData)
      this.data.processedData = newData.map(item => ({
        name: item.staffName,
        content: item.staffAffiliatedUnit,
        Id: item.staffIdcard,
      }));
    },
    fail: (error) => {
      console.error("请求失败", error);
    },
  });
},

  onLoad: function (options) {
    this.setData({
      username:options.username,
      staff:true,
    contorl:false,
    })
    if(!this.data.infoQueryTriggered){
      this.fetchdata();
      this.setData({
        infoQueryTriggered:true,
      })
    }
  },
  clickItem: function (event) {
    // 获取点击项的索引
    const index = this.data.showIndex;
    const index1 = event.currentTarget.dataset.index;
    console.log(index1)
    // 使用索引访问questList中的相应数据
    const clickedItem = this.data.questList[index].list[index1];
    wx.navigateTo({
      url: '../editpower/editpower?StaffIdcard='+clickedItem.Id+'&username=' + this.data.username,
    })
    // 现在您可以对点击的项进行操作
    console.log('点击的项:', clickedItem);
  },

confirm:function (e) {
  wx.request({
    url: 'http://localhost:8081/lockdown',
    method:'POST',
    header:{
      'Content-Type': 'application/json',
    },
    data:{
      place:this.data.mainpower,
      reason:this.data.secondarypower,
      start:this.data.start,
      end:this.data.end,
    },
    success: (res) => {
      const newData = res.data; // 假设后端返回的数据在 res.data 中
      console.log(newData)
    },
    fail: (error) => {
      console.error("请求失败", error);
    },
  })
},
  board:function (e) {
   wx.showToast({
     title: '无法编辑',
     icon:'error'
   }) 
  },
  newstaff:function (e) {
    wx.navigateTo({
      url: '../../../pages/new-staff/new-staff',
    })
  },
});
