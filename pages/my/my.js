var app = getApp(),
util = require('../../utils/util'),
conf = require('../../utils/conf');
Page({
    data : {
        topics : []
    },
    loadMyTopic : function(that){
       util.serviceUtil.get(conf.service.findTopicsByOwner,{
           sessionId : wx.getStorageSync('sessionId')
       },function(res){
            that.setData({topics : res.data.success});
       },function(err){
            console.log(err);
       }); 
    },
    onShow : function(){
        var that = this;
        app.login(function(){
           that.loadMyTopic(that);
        });
    }
});