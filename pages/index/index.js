//index.js
var util = require('../../utils/util'),
conf = require('../../utils/conf');
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
      wx.getLocation({
        type : 'wgs84',
        success : function(res){
           var lat = res.latitude;
           var lng = res.longitude;
           util.serviceUtil.post(conf.service.loadHomePageCommunities,{
              location : [lng,lat]
           },function(res){
              console.log(res);
           },function(err){
               console.log(err);
           });
        }
      });
  }
})
