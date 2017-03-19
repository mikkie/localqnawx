var conf = require('../../utils/conf');
var utils = require('../../utils/util');
var app = getApp();
Page({
    data : {
       currentLoc : "请选择位置",
       communityId : '',
       topics : []
    },
    onShareAppMessage: function () {
      var that = this;  
      return {
        title: that.data.currentLoc + '-邻答',
        path: '/pages/topicList/topicList?communityId='+ that.data.communityId +'&curLocl=' + that.data.currentLoc
      };
    },
    loadTopicsByCommunityId : function(that){
        utils.serviceUtil.get(conf.service.findTopicsByCommunityId,{communityId : this.data.communityId,sessionId : app.globalData.sessionId},function(res){
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
        this.setData({currentLoc : options.curLocl,communityId : options.communityId});
    },
    onShow : function(){
        var that = this; 
        app.login(function(){
           that.loadTopicsByCommunityId(that);
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