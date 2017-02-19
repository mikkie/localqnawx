//index.js
//获取应用实例
var app = getApp()
Page({
  data: {
    currentLoc : ''
  },
  openMap : function(event){
      var that = this;   
      wx.chooseLocation({
          success : function(obj){
             that.setData({currentLoc : obj.name});
          }
      });
  },
  onLoad: function () {

  }
})
