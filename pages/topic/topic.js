var conf = require('../../utils/conf');
var utils = require('../../utils/util');
var app = getApp();
Page({
    data : {
      topicId : null,
      content : '',
      topic : null,
      comments : [],
      anonymous : false
    },
    onLoad : function(options){
        this.setData({topicId : options.topicId});
    },
    loadComment : function(){
       var that = this; 
       utils.serviceUtil.get(conf.service.findCommentsByTopicId,{
              topicId : that.data.topicId
       },function(res){
              that.setData({comments : res.data.success});
       },function(err){
               console.log(err);
       });
    },
    onShow : function(){
       var that = this; 
       utils.serviceUtil.get(conf.service.getTopicById,{
            topicId : that.data.topicId,
       },function(res){
            that.setData({topic : res.data.success}); 
       },function(err){
            console.log(err);
       });
       this.loadComment();
    },
    toggleAnonymous : function(e){
       this.setData({anonymous: e.detail.value.length == 1});
    },
    submitComment : function(){
        var that = this;
        if(utils.stringUtil.isEmptyOrNull(this.data.content)){
           return;
        }
        app.getUserInfo(function(userInfo){
          if(userInfo){
             utils.serviceUtil.post(conf.service.createNewComment,{
              userInfo : userInfo,
              content : that.data.content,
              sessionId : wx.getStorageSync('sessionId'),
              topicId : that.data.topicId,
              anonymous : that.data.anonymous,
              to : []
           },function(res){
              that.setData({content : ''}); 
              that.loadComment();
           },function(err){
               console.log(err);
           });
          }
        });
    },
    confirmContent : function(e){
        this.data.content = e.detail.value;
    }
});