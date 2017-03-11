var util = require('./utils/util');
var conf = require('./utils/conf');
//app.js
App({
  getUserInfo : function(callback){
    if(this.globalData.userInfo){
       if(typeof callback == 'function'){
          callback(this.globalData.userInfo);
       }
       return;
    }
    this.doGetUserInfo(callback); 
  },
  doGetUserInfo : function(callback){
    var that = this;
    wx.getUserInfo({
      success: function(res) {
        that.globalData.userInfo = res.userInfo;
        if(typeof callback == 'function'){
           callback(res.userInfo);
        }
      }
    });
  },
  doLogin : function(callback,that){
     wx.login({
      success: function (result) {
         util.serviceUtil.post(conf.service.login,{code : result.code},function(res){
           wx.setStorageSync('sessionId', res.data.success.sessionId);
           wx.setStorageSync('settings', res.data.success.settings);
           console.log('sessionId=' + res.data.success);
           if(typeof callback == 'function'){
              callback();
           }
       },function(err){
           console.log(err);
       });
      }
   });  
  },
  login:function(callback){
    if(!this.globalData.init){
        this.doLogin(callback,that);
        this.globalData.init = true;
        return;
    }
    var that = this;
    wx.checkSession({
      success: function(){
         callback();
      },
      fail: function(){
         that.doLogin(callback,that);
      }
    });
  },
  onShow : function(){
       this.globalData.init = false;
       this.doGetUserInfo(null);
  },
  globalData : {
     init : false,
     userInfo : null
  }
})