var conf = require('../../utils/conf');
var utils = require('../../utils/util');
var app = getApp();
Page({
    data : {
       currentLoc : "请选择位置",
       communityId : '',
       topics : [],
       contentHeight : '400px',
       permission : {
          "public" : 'rw',
          "owner" : false
       }
    },
    backHome : function(){
      wx.switchTab({
        url: '/pages/index/index'
      });
    },
    onShareAppMessage: function () {
      var that = this;  
      return {
        title: that.data.currentLoc + '-邻答',
        path: '/pages/topicList/topicList?communityId='+ that.data.communityId +'&curLocl=' + that.data.currentLoc + '&public=' +  that.data.permission.public
      };
    },
    loadTopicsByCommunityId : function(that){
        utils.serviceUtil.get(conf.service.findTopicsByCommunityId,{communityId : that.data.communityId,sessionId : app.globalData.sessionId},function(res){
           if(res.data && res.data.success){
             that.setData({topics : res.data.success});
           }
           else{
             console.log(res.data.error);  
           }
        },function(err){
            console.log(err); 
        });
    },
    onPullDownRefresh : function(){
      this.loadTopicsByCommunityId(this);
      wx.stopPullDownRefresh(); 
    },
    onLoad : function(options){
        var res = wx.getSystemInfoSync();
        this.setData({contentHeight:(res.windowHeight - 120) + 'px'});
        this.setData({currentLoc : options.curLocl,communityId : options.communityId});
        if(options.public == 'r'){
          this.data.permission.public = options.public;
          this.setData({permission : this.data.permission});
        }
        wx.setNavigationBarTitle({
              title: this.data.currentLoc + '-邻答'
        });
    },
    onShow : function(){
        var that = this; 
        app.login(function(){
           that.loadTopicsByCommunityId(that);
           if(that.data.permission.public == 'r'){
              utils.serviceUtil.post(conf.service.isCommunityOwnByUser,{
                communityId : that.data.communityId,
                sessionId : app.globalData.sessionId
              },function(res){
                 if(res.data.success){
                   that.data.permission.owner = true;
                   that.setData({contentHeight:(wx.getSystemInfoSync().windowHeight - 60) + 'px'});
                   that.setData({permission : that.data.permission});
                 }
              },function(err){
                 console.log(err);
              });
           }
        });
    },
    handleStar : function(e){
     var index = e.currentTarget.dataset.index;
     var topic = this.data.topics[index];
     if(topic.star){
        delete topic.star;
     }
     else{
        topic.star = true;
     }
     this.setData({topics : this.data.topics});
     utils.serviceUtil.post(conf.service.toggleStarTopic,{
              topicId : e.currentTarget.dataset.topicid,
              isAdd : e.currentTarget.dataset.isadd, 
              sessionId : app.globalData.sessionId
           },function(res){
              //that.setData({communities : res.data.success});
           },function(err){
               console.log(err);
            });
   }
});