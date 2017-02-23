//index.js
var util = require('../../utils/util'),
conf = require('../../utils/conf');
//获取应用实例
var app = getApp()
Page({
  data: {
    currentLoc : '',
    communities : []
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
      var that = this;
      app.login(function(){
        wx.getLocation({
          type : 'wgs84',
          success : function(res){
             var lat = res.latitude;
             var lng = res.longitude;
             util.serviceUtil.post(conf.service.loadHomePageCommunities,{
              location : [lng,lat],
              sessionId : wx.getStorageSync('sessionId')
           },function(res){
              var array = [];
              util.arrayUtil.mergeArray(array,res.data.success.near);
              util.arrayUtil.mergeArray(array,res.data.success.recommend);
              that.setData({communities : array});
           },function(err){
               console.log(err);
           });
         }
       });
      });
  }
})
