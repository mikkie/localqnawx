var utils = require('../../utils/util.js');
var conf = require('../../utils/conf.js');
Page({
  data: {
    currentLoc : '选择位置',
    communityName : '',
    pos : []
  },
  openMap : function(event){
      var that = this;   
      wx.chooseLocation({
          success : function(obj){
             if(obj.name){
                that.setData({currentLoc : obj.name,communityName : obj.name,pos : [parseFloat(obj.longitude),parseFloat(obj.latitude)]});
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
          utils.serviceUtil.post(conf.service.createCommunity,{
              location : this.data.pos,
              sessionId : wx.getStorageSync('sessionId'),
              name : this.data.communityName
           },function(res){
              if(res.data["401"]){
                 wx.showModal({
                   title: '无权限',
                   content: res.data["401"],       
                 });
              }
              else{
                wx.switchTab({
                   url: '../star/star'
                });
              }
           },function(err){
               console.log(err);
           });
         }
      }
});