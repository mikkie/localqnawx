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
    tagReaded : function(that){
       utils.serviceUtil.post(conf.service.tagTopicReaded,{
              topicId : that.data.topicId,
              sessionId : wx.getStorageSync('sessionId')
       },function(res){
       },function(err){
              console.log(err);
       });
    },
    loadComment : function(){
       var that = this; 
       utils.serviceUtil.get(conf.service.findCommentsByTopicId,{
              topicId : that.data.topicId,
              sessionId : wx.getStorageSync('sessionId')
       },function(res){
              that.setData({comments : res.data.success});
              if(res.data.success && res.data.success.length > 0){
                 that.tagReaded(that);
              }
       },function(err){
               console.log(err);
       });
    },
    onShow : function(){
       var that = this; 
       utils.serviceUtil.get(conf.service.getTopicById,{
            topicId : that.data.topicId,
            sessionId : wx.getStorageSync('sessionId')
       },function(res){
            if(res.data.success && res.data.success.length == 1){
               that.setData({topic : res.data.success[0]}); 
            }
            else{
               wx.showModal({
                   title: '提示',
                   content: '本话题已移除',
                   showCancel : false,
                   success: function(res) {
                      if (res.confirm) {
                         wx.navigateBack({delta: 1});
                      }
                   }       
               });
            }
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
              if(res.data["401"]){
                 wx.showModal({
                   title: '无权限',
                   content: res.data["401"],
                   showCancel : false       
                 });
              }
              else{
                 that.loadComment();   
              }
           },function(err){
               console.log(err);
           });
          }
        });
    },
    confirmContent : function(e){
        this.data.content = e.detail.value;
    },
    upAndDownComment : function(e){
        var index = e.target.dataset.index;
        var isUp = e.target.dataset.isup;
        if(isUp == 'true'){
            if(this.data.comments[index].thumbup){
                return;
            }
            else{
               this.data.comments[index].thumbup = true;
               this.data.comments[index].up++;
               this.setData({comments : this.data.comments}); 
            }
        }
        else{
            if(this.data.comments[index].thumbdown){
                return;
            }
            else{
               this.data.comments[index].thumbdown = true;
               this.data.comments[index].down++;
               this.setData({comments : this.data.comments}); 
            }
        }
        utils.serviceUtil.get(conf.service.upOrDownComment,{
              commentId : e.target.dataset.commentid,
              isUp : isUp
           },function(res){
              //that.setData({content : ''}); 
              //that.loadComment();
           },function(err){
               console.log(err);
           });
    },
    deleteTopic : function(e){
       wx.showModal({
          title: '删除确认',
          content: '确认删除该话题?',
          success: function(res) {
              if (res.confirm) {
                  var topicid = e.target.dataset.topicid;
                  utils.serviceUtil.post(conf.service.deleteTopic,{
                     sessionId : wx.getStorageSync('sessionId'),
                     topicId : topicid
                  },function(res){
                     wx.navigateBack({delta: 1});
                  },function(err){
                     console.log(err);
                  });
              }
          }       
       });
    },
    deleteComment : function(){
      wx.showModal({
          title: '删除确认',
          content: '确认删除该评论?',
          success: function(res) {
              if (res.confirm) {
                  var commentid = e.target.dataset.commentid;
                  utils.serviceUtil.post(conf.service.deleteComment,{
                     sessionId : wx.getStorageSync('sessionId'),
                     commentId : commentid
                  },function(res){
                     wx.navigateBack({delta: 1});
                  },function(err){
                     console.log(err);
                  });
              }
          }       
      });
    }
});