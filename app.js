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
  doLogin : function(callback,that){
     wx.login({
      success: function (result) {
         util.serviceUtil.post(conf.service.login,{code : result.code},function(res){
           wx.setStorageSync('sessionId', res.data.success.sessionId);
           wx.setStorageSync('settings', res.data.success.settings);
           console.log('sessionId=' + res.data.success);
           that.getUserInfo();
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
      this.doLogin(null,this);
  },
  globalData : {
     userInfo : null
  }
})