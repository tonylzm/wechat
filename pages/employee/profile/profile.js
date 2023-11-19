Page({
  data: {
    visitorName:'',
    affiliatedUnit:'',
    idcard:'',
    visitorPhone:'',
    text:'',
    infoQueryTriggered: false, // 添加一个标志
  },

  // 点击text元素时切换内容的显示状态
  toggleContent: function (event) {
    const type = event.currentTarget.dataset.type;
    if (type === 'info') {
      if (!this.data.infoQueryTriggered) {
        this.detailed();
        this.setData({ infoQueryTriggered: true });
      }
    }
  },

  onLoad: function(options){
    console.log('接收到的参数是：', options);
    this.setData({
      text:options.id,
    })
    this.toggleContent({ currentTarget: { dataset: { type: 'info' } } });
  },

  detailed:function(){
//后端获取数据
  wx.request({
      url: 'http://localhost:8081/staffinfo',
      method:"GET",
      header:{
        "content-type":"application/x-www-form-urlencoded"
      },
      data:{
        StaffIdcard:this.data.text,
      },
      success: (res) => {
        console.log("成功",res)
        this.setData({
          visitorName: res.data.staffName,
          affiliatedUnit:res.data.staffAffiliatedUnit+" "+res.data.staffPosition,
          idcard:res.data.staffIdcard,
          visitorPhone:res.data.staffPhone,  
        })
        },    
      fail(res){
        console.log("失败",res)
      }
    })
  }
});
