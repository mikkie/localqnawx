var util = require('./utils/util');
var conf = require('./utils/conf');
//app.js
App({
  onLaunch: function () {
    var that = this;
    this.getUserInfo(function(res,code){
      that.decryptData(res,code);
    });
  },
  decryptData : function(res,code){
     util.serviceUtil.post(conf.service.decrptUserInfo,{
              code : code,
              encryptedData : res.encryptedData,
              iv : res.iv
           },function(result){
              console.log(result)
           });
  },
  getUserInfo:function(cb){
    var that = this
    if(this.globalData.user){
      // typeof cb == "function" && cb(this.globalData.user)
    }else{
      //调用登录接口
      wx.login({
        success: function (result) {
          wx.getUserInfo({
            success: function (res) {
              that.globalData.user = res
              typeof cb == "function" && cb(res,result.code)
            }
          })
        }
      })
    }
  },
  globalData:{
    user:null
  }
})