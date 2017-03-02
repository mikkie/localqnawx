var util = require('./utils/util');
var conf = require('./utils/conf');
//app.js
App({
  onLaunch: function () {

  },
  getUserInfo : function(callback){
    if(this.globalData.userInfo){
       if(typeof callback == 'function'){
          callback(this.globalData.userInfo);
       }
       return;
    }
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        that.globalData.userInfo = res.userInfo;
        if(typeof callback == 'function'){
           callback(res.userInfo);
        }
      }
    }) 
  },
  login:function(callback){
    if(this.globalData.login){
       callback();
       return;
    }
    //调用登录接口
    var that = this;
    wx.login({
      success: function (result) {
         util.serviceUtil.post(conf.service.login,{code : result.code},function(res){
           wx.setStorageSync('sessionId', res.data.success.sessionId);
           wx.setStorageSync('settings', res.data.success.settings);
           console.log('sessionId=' + res.data.success);
           that.globalData.login = true;
           callback();
           that.getUserInfo();
       },function(err){
           console.log(err);
       });
      }
   })
  },
  globalData : {
     login : false,
     userInfo : null
  }
})