import drawQrcode from '../../utils/weapp.qrcode.esm.js';
Page({
  data: {
    qrcodeWidth: 0,
    qrcodedata: ''
  },
  onLoad: function (options) {
    const StaffIdcard = options.StaffIdcard;
    console.log("Received StaffIdcard:", StaffIdcard);
    var that = this; // 声明一个变量来保存当前页面的上下文
    wx.request({
      url: 'http://localhost:8081/staffqrcode',
      responseType: 'arraybuffer', // 响应数据类型为二进制数据
      method:"get",
      header: {
        "content-type": "application/x-www-form-urlencoded"
      },
      data: {
        StaffIdcard: options.StaffIdcard,
      },
      success: function (res) {
        if (res.statusCode === 200) {
          // 获取到二维码图片的二进制数据
          const qrCodeData = res.data;    
          // 将二进制数据转换成base64
          const qrCodeBase64 = wx.arrayBufferToBase64(qrCodeData);    
          // 设置二维码图片数据到小程序页面的data中，以在页面中显示
          that.setData({
            qrCodeImage: 'data:image/png;base64,' + qrCodeBase64
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

  // generateQRCode: function () {
  //   var that = this;
  //   console.log(that.data.qrcodedata)
  //   const jsonString = JSON.stringify(that.data.qrcodedata);
  //   drawQrcode({
  //     width: 200,
  //     height: 200,
  //     canvasId: 'myQrcode',
  //     background: '#ffffff',
  //     foreground: '#000000',
  //     text: jsonString, // 使用 that 来获取数据
  //     image: {
  //       dx: 70,
  //       dy: 70,
  //       dWidth: 60,
  //       dHeight: 60
  //     }
  //   });
  // }
});
