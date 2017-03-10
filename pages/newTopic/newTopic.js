var app = getApp();
var utils = require('../../utils/util.js');
var conf = require('../../utils/conf.js');
Page({
  data:{
    periodArray : ['5分钟','1小时','4小时','24小时','7天'],
    periodIndex : 2,
    currentLoc : '',
    communityId : '',
    content : '',
    expireLengths : ['5','1','4','24','7'],
    expireDateUnits : ['m','h','h','h','d'],
    anonymous : false
  },
  confirmContent : function(e){
     this.data.content = e.detail.value;
  },
  toggleAnonymous : function(e){
     this.setData({anonymous: e.detail.value});
  },
  listenerPeriodSelected: function(e) {
      this.setData({
        periodIndex: e.detail.value
      });
  },
  submitTopic : function(e){
     var that = this;
     if(utils.stringUtil.isEmptyOrNull(this.data.communityId) || utils.stringUtil.isEmptyOrNull(this.data.currentLoc) || utils.stringUtil.isEmptyOrNull(this.data.content)){
         return;
     }
     app.getUserInfo(function(userInfo){
        if(userInfo){
          utils.serviceUtil.post(conf.service.createNewTopic,{
              userInfo : userInfo,
              content : that.data.content,
              sessionId : wx.getStorageSync('sessionId'),
              communityId : that.data.communityId,
              communityName : that.data.currentLoc,
              expireLength : that.data.expireLengths[that.data.periodIndex],
              expireDateUnit : that.data.expireDateUnits[that.data.periodIndex],
              anonymous : that.data.anonymous
           },function(res){
              if(res.data["401"]){
                 wx.showModal({
                   title: '无权限',
                   content: res.data["401"],
                   showCancel : false       
                 });
              }
              else{
                 wx.navigateBack({delta: 1}) 
              }
           },function(err){
               console.log(err);
           });
        }
     });

  },
  onLoad : function(options){
       this.setData({currentLoc : options.curLocl,communityId : options.communityId});
  } 
})