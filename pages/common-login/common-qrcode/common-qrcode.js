import drawQrcode from '../../utils/weapp.qrcode.esm.js';
Page({
  data: {
    qrcodeWidth: 0,
    qrcodedata: '',
    time1:'',
  },
  onLoad: function (options) {
    const time=options.time;
    const visitPhone=options.visitPhone;
    var that = this;
wx.request({
  url: 'http://localhost:8081/qrcode', // 替换成您的后端API地址
  responseType: 'arraybuffer', // 响应数据类型为二进制数据
  method:"get",
  data:{
    visitorPhone: visitPhone
  },
  success: function (res) {
    if (res.statusCode === 200) {
      // 获取到二维码图片的二进制数据
      const qrCodeData = res.data;

      // 将二进制数据转换成base64
      const qrCodeBase64 = wx.arrayBufferToBase64(qrCodeData);

      // 设置二维码图片数据到小程序页面的data中，以在页面中显示
      that.setData({
        qrCodeImage: 'data:image/png;base64,' + qrCodeBase64,
        time1:time
      });
    } else {
      console.error('Failed to fetch QR code image');
    }
  },
  fail: function (error) {
    console.error('Network request failed', error);
  }
});

  },
  onHide: function () {
    // 当页面隐藏时，清除定时器
    if (this.intervalId) {
      clearInterval(this.intervalId);
    }
  },
});
