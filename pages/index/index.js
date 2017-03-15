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
  onShareAppMessage: function () {
    return {
      title: '连接社区，分享智慧-邻答',
      path: '/page/index/index'
    };
  },
  openMap : function(event){
      var that = this;   
      wx.chooseLocation({
          success : function(obj){
             that.setData({currentLoc : obj.name});
             that.findCommunitiesByLocAndRecommend([parseFloat(obj.longitude),parseFloat(obj.latitude)],that);
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
              distance : wx.getStorageSync('settings').distance,
              sessionId : wx.getStorageSync('sessionId')
           },function(res){
              if(res.data.success){
                var array = [];
                util.arrayUtil.mergeArray(array,res.data.success.near);
                util.arrayUtil.mergeArray(array,res.data.success.recommend);
                that.setData({communities : array}); 
              }
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
          },
          fail : function(){
              wx.showModal({
                   title: '提示',
                   content: '无法获取当前位置，请确保微信定位功能开启。',
                   showCancel : false
              });
          }
       });
  },
  onPullDownRefresh : function(){
      this.loadHomePageCommunities(this);
      wx.stopPullDownRefresh(); 
  },
  onLoad : function () {
      var that = this;
      that.setData({currentLoc : ''});
      app.login(function(){
           that.loadHomePageCommunities(that);  
      });
  }
})
