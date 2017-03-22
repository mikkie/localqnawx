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
  doLogin : function(callback){
     var that = this;
     wx.login({
      success: function (result) {
         util.serviceUtil.post(conf.service.login,{code : result.code},function(res){
           // wx.setStorageSync('sessionId', res.data.success.sessionId);
           that.globalData.sessionId = res.data.success.sessionId;
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
        this.globalData.init = true;
        this.doLogin(callback);
        return;
    }
    var that = this;
    wx.checkSession({
      success: function(){
         callback();
      },
      fail: function(){
         that.doLogin(callback);
      }
    });
  },
  checkNetwork : function(){
     var that = this;
     setInterval(function(){
         wx.getNetworkType({
            success : function(res){
               if(that.globalData.networkType && that.globalData.networkType != 'none' && res.networkType == 'none'){
                  wx.showModal({
                    title : '网络异常',
                    content : '你已进入没有网络的异次元，请检查网络连接',
                    showCancel : false
                  }); 
               }
               that.globalData.networkType = res.networkType;  
            }
         });
     },15000);
  },
  onLaunch : function(){
       this.globalData.init = false;
       this.checkNetwork();
  },
  onShow : function(){
    if(conf.app.debug == true){
       this.globalData.init = false;
    }
    this.doGetUserInfo(null);
  },
  globalData : {
     init : false,
     sessionId : '',
     userInfo : null,
     networkType : ''
  },
  showLoading:function(){
        wx.showToast({
         title: '加载中',
         icon: 'loading',
         duration: 10000
        });
   },
   cancelLoading:function(){
        wx.hideToast();
   },
   debugInfo : function(title){
      wx.showToast({
         title: title,
         icon: 'success'
      });
   }
})