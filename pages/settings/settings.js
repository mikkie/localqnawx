var app = getApp(),
util = require('../../utils/util'),
conf = require('../../utils/conf');
Page({
   data : {
       settings : null,
       userInfo : null,
       globalSettings : null 
   },
   onShow : function(){
        var that = this;
        app.login(function(){
           that.setData({userInfo : app.globalData.userInfo});
           that.setData({settings : wx.getStorageSync('settings')}); 
           that.loadGlobalSettings(that);
        });
    },
    onPullDownRefresh : function(){
      this.setData({userInfo : app.globalData.userInfo});
      this.setData({settings : wx.getStorageSync('settings')}); 
      this.loadGlobalSettings(this);
      wx.stopPullDownRefresh(); 
    },
    loadGlobalSettings : function(that){
        util.serviceUtil.get(conf.service.getGlobalSettings,{},function(res){
           that.setData({'globalSettings':res.data.success});
       },function(err){
           console.log(err);
       });
    },
    updateSettings : function(that){
       util.serviceUtil.post(conf.service.updateSettings,{sessionId : app.globalData.sessionId,
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