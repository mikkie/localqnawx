//index.js
var util = require('../../utils/util'),
conf = require('../../utils/conf');
//获取应用实例
var app = getApp();
Page({
  data: {
    currentLoc : '',
    communities : []
  },
  openMap : function(event){
      var that = this;   
      wx.chooseLocation({
          success : function(obj){
             that.setData({currentLoc : obj.name});
             that.findCommunitiesByLocAndRecommend([obj.longitude,obj.latitude],that);
          }
      });
  },
  handleStar : function(e){
     var index = e.currentTarget.dataset.index;
     var community = this.data.communities[index];
     if(community.star){
        delete community.star;
     }
     else{
        community.star = true;
     }
     this.setData({communities : this.data.communities});
     util.serviceUtil.post(conf.service.toggleStarCommunity,{
              communityId : e.currentTarget.dataset.communityid,
              isAdd : e.currentTarget.dataset.isadd, 
              sessionId : wx.getStorageSync('sessionId')
           },function(res){
              //that.setData({communities : res.data.success});
           },function(err){
               console.log(err);
            });
  },
  bindSearchCommunity : function(e){
     var that = this;
     var name = e.detail.value;
     if(!util.stringUtil.isEmptyOrNull(name)){
        util.serviceUtil.post(conf.service.findCommunityByName,{
              name : name,
              sessionId : wx.getStorageSync('sessionId')
           },function(res){
              that.setData({communities : res.data.success});
           },function(err){
               console.log(err);
           });
     }
     else{
        that.loadHomePageCommunities(that);
     } 
  },
  findCommunitiesByLocAndRecommend : function(loc,that){
           util.serviceUtil.post(conf.service.loadHomePageCommunities,{
              location : loc,
              sessionId : wx.getStorageSync('sessionId')
           },function(res){
              var array = [];
              util.arrayUtil.mergeArray(array,res.data.success.near);
              util.arrayUtil.mergeArray(array,res.data.success.recommend);
              that.setData({communities : array});
           },function(err){
               console.log(err);
           });
  },
  loadHomePageCommunities : function(that){
     wx.getLocation({
          type : 'wgs84',
          success : function(res){
             var lat = res.latitude;
             var lng = res.longitude;
             that.findCommunitiesByLocAndRecommend([lng,lat],that);
         }
       });
  },
  onShow: function () {
      var that = this;
      app.login(function(){
         that.loadHomePageCommunities(that);
      });
  }
})
