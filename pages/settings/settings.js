var app = getApp(),
util = require('../../utils/util'),
conf = require('../../utils/conf');
Page({
   data : {
       settings : null,
       userInfo : null
   },
   onShow : function(){
        var that = this;
        app.login(function(){
           that.setData({userInfo : app.globalData.userInfo});
           that.setData({settings : wx.getStorageSync('settings')}); 
        });
    },
    updateSettings : function(that){
       util.serviceUtil.post(conf.service.updateSettings,{sessionId : wx.getStorageSync('sessionId'),
           settings : that.data.settings},function(res){
           wx.setStorageSync('settings',res.data.success);
       },function(err){
           console.log(err);
       });
    },
    changeDistance : function(e){
        this.data.settings.distance = e.detail.value;
        this.updateSettings(this);
    }
});