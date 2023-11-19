// invite/pages/editpower/editpower.js
Page({

  /**
   * 页面的初始数据
   */
  data: {
    mainpower: '', // 存储后端返回的 mainpower 数据
    secondarypower:'',
    checkboxItems: [
      { value: "系统管理员", checked: false },
      { value: "主管", checked: false },
      // 添加其他复选框项...
    ],
    checkboxItems1: [
      { value: "仓库", checked: false },
      { value: "办公大楼", checked: false },
      // 添加其他复选框项...
    ],
    edit:'',
    StaffIdcard:'',
    staffName:'',
    staffId:'',
    staffAffiliatedUnit:'',
  },

  /**
   * 生命周期函数--监听页面加载
   */
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
  checkboxChange: function (e) {
    const selectedItems = e.detail.value;
    const mainpower = selectedItems.join(",");
    this.setData({
      mainpower: mainpower,
    });
  },
  checkboxChange1: function (e) {
    const selectedItems = e.detail.value;
    const secondarypower = selectedItems.join(",");
    this.setData({
      secondarypower: secondarypower,
    });
  },
  onLoad(options) {
    this.setData({
      StaffIdcard:options.StaffIdcard,
      edit:options.username
    })
    this.staffinfon()
  },

  staffinfon:function() {
    wx.request({
      url: 'http://localhost:8081/staffinfo',
      method:'GET',
      data:{
        StaffIdcard:this.data.StaffIdcard,
      },
      success: (res) => {
        const newData = res.data; // 假设后端返回的数据在 res.data 中
        console.log(newData)
        this.setData({
          staffId:newData.staffIdcard,
          staffName:newData.staffName,
          staffAffiliatedUnit:newData.staffAffiliatedUnit+' '+newData.staffPosition,
          mainpower: newData.mainpower,
          secondarypower: newData.secondarypower,
        })
       // 匹配后端数据中的 mainpower，设置复选框的选中状态
       this.matchMainpower();
       this.matchsecondarypower();
      },
      fail: (error) => {
        console.error("请求失败", error);
      },
    });
  },
  
  confirm:function (e) {
    wx.request({
      url: 'http://localhost:8081/updatepower',
      method:'GET',
      data:{
        edit:this.data.edit,
        StaffIdcard:this.data.StaffIdcard,
        mainpower:this.data.mainpower,
        secondarypower:this.data.secondarypower,
      },
      success: (res) => {
       if(res.data=="修改成功"){
         wx.showToast({
           title: '修改权限成功',
           icon:'success'
         })
       }else{
         wx.showToast({
           title: '权限不足',
           icon:'error'
         })
       }
      
      },
      fail: (error) => {
        console.error("请求失败", error);
      },
    })
    
  }
})