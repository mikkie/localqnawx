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
  checkNetwork : function(){
     var that = this;
     setInterval(function(){
         wx.getNetworkType({
            success : function(res){
               if(that.globalData.networkType != 'none' && res.networkType == 'none'){
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
  onShow : function(){
       this.globalData.init = false;
       this.doGetUserInfo(null);
       this.checkNetwork();
  },
  globalData : {
     init : false,
     userInfo : null,
     networkType : ''
  },
  showLoading:function(){
        wx.showToast({
         title: '加载中',
         icon: 'loading'
        });
   },
   cancelLoading:function(){
        wx.hideToast();
   }
})