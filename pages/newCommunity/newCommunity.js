var app = getApp();
var utils = require('../../utils/util.js');
var conf = require('../../utils/conf.js');
Page({
  data: {
    currentLoc : '选择位置',
    communityName : '',
    pos : [],
    permission : null,
    submitDisabled : false
  },
  onLoad : function(){
     wx.setNavigationBarTitle({
        title: '新建地点-邻答'
     });
  },
  /*privateCommunity : function(e){
     if(e.detail.value){
         this.setData({permission: {"public" : "r"}}); 
     }
     else{
         this.setData({permission: null});
     }
  },*/
  openMap : function(event){
      var that = this;   
      wx.chooseLocation({
          success : function(obj){
             var name = obj.name || obj.address;
             if(name){
                that.setData({currentLoc : name,pos : [parseFloat(obj.longitude),parseFloat(obj.latitude)]});
                if(!that.data.communityName){
                   that.setData({communityName : name});
                }
             } 
          }
      });
  },
  bindNameInput : function(e){
      this.setData({
          communityName : e.detail.value
      });
  },
  submitNewCommunity : function(){
      if(this.data.currentLoc == '选择位置' || utils.stringUtil.isEmptyOrNull(this.data.communityName) || this.data.pos.length == 0){
         return false;
      }
      else{
          var that = this;
          this.setData({submitDisabled : true});
          utils.serviceUtil.post(conf.service.createCommunity,{
              location : this.data.pos,
              sessionId : app.globalData.sessionId,
              name : utils.stringUtil.trim(this.data.communityName),
              permission : this.data.permission
           },function(res){
              if(res.data["401"]){
                 wx.showModal({
                   title: '无权限',
                   content: res.data["401"],
                   showCancel : false       
                 });
              }
              else if(res.data.warn){
                wx.showModal({
                   title: '警告',
                   content: res.data.warn,
                   showCancel : false       
                });
              }
              else{
                wx.redirectTo({url: '../topicList/topicList?communityId=' + res.data.success._id + '&curLocl=' + res.data.success.name + '&public=' + res.data.success.permission.public});
              }
              that.setData({submitDisabled : false});
           },function(err){
               console.log(err);
               that.setData({submitDisabled : false});
           });
         }
      }
});