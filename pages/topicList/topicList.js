var conf = require('../../utils/conf');
var utils = require('../../utils/util');
var app = getApp();
Page({
    data : {
       currentLoc : "请选择位置",
       communityId : '',
       topics : []
    },
    loadTopicsByCommunityId : function(that){
        utils.serviceUtil.get(conf.service.findTopicsByCommunityId,{communityId : this.data.communityId,sessionId : wx.getStorageSync('sessionId')},function(res){
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
    onLoad : function(options){
       var that = this; 
       this.setData({currentLoc : options.curLocl,communityId : options.communityId});
       app.login(function(){
           that.loadTopicsByCommunityId(that);
       });
    }
});