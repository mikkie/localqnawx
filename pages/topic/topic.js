var conf = require('../../utils/conf');
var utils = require('../../utils/util');
var app = getApp();
Page({
    data : {
      topicId : null,
      content : '',
      topic : null,
      comments : [],
      anonymous : false,
      contentHeight : '400px',
      submitDisabled : false
    },
    previewPic : function(e){
       var that = this;
       wx.previewImage({
           current : e.currentTarget.dataset.src,
           urls: that.data.topic.images 
       });
    },
    buildTitle : function(that){
       if(that.data.topic){
          return (that.data.topic.content ? that.data.topic.content : '来自' + that.data.topic.community.name + '的图片话题') + '-邻答';
       }
       else{
          return '话题-邻答';
       }
    },
    onShareAppMessage: function () {
      return {
        title: this.buildTitle(this),
        path: '/pages/topic/topic?topicId=' + this.data.topicId
      };
    },
    onLoad : function(options){
        var res = wx.getSystemInfoSync();
        this.setData({contentHeight:(res.windowHeight - 70) + 'px'});
        this.setData({topicId : options.topicId});
    },
    onShow : function(){
        var that = this;
        app.login(function(){
           that.loadData(that);    
        });
    },
    tagReaded : function(that){
       utils.serviceUtil.post(conf.service.tagTopicReaded,{
              topicId : that.data.topicId,
              sessionId : app.globalData.sessionId
       },function(res){
       },function(err){
              console.log(err);
       });
    },
    loadComment : function(){
       var that = this; 
       utils.serviceUtil.get(conf.service.findCommentsByTopicId,{
              topicId : that.data.topicId,
              sessionId : app.globalData.sessionId
       },function(res){
              that.setData({comments : res.data.success});
              if(res.data.success && res.data.success.length > 0){
                 that.tagReaded(that);
              }
       },function(err){
               console.log(err);
       });
    },
    loadData : function(that){
        utils.serviceUtil.get(conf.service.getTopicById,{
            topicId : that.data.topicId,
            sessionId : app.globalData.sessionId
       },function(res){
            if(res.data.success && res.data.success.length == 1){
               that.setData({topic : res.data.success[0]}); 
               wx.setNavigationBarTitle({
                  title: that.buildTitle(that)
               });
            }
            else if(!res.data["401"]){
               wx.showModal({
                   title: '提示',
                   content: '本话题已移除',
                   showCancel : false,
                   success: function(result) {
                      if (result.confirm) {
                         wx.navigateBack({delta: 1});
                      }
                   }       
               });
            }
       },function(err){
            console.log(err);
       });
       that.loadComment();
    },
    onPullDownRefresh : function(){
      this.loadData(this); 
      wx.stopPullDownRefresh(); 
    },
    toggleAnonymous : function(e){
       this.setData({anonymous: e.detail.value.length == 1});
    },
    clearComment : function(that){
       var doClear = function(){
           that.setData({content : ''});
       };
       //bug
       setTimeout(doClear,300);
    },
    submitComment : function(e){
        var content = e.detail.value.content;
        var that = this;
        if(utils.stringUtil.isEmptyOrNull(content)){
           that.clearComment(that); 
           return;
        }
        that.setData({submitDisabled : true});
        app.getUserInfo(function(userInfo){
          if(userInfo){
             utils.serviceUtil.post(conf.service.createNewComment,{
              userInfo : userInfo,
              content : content,
              sessionId : app.globalData.sessionId,
              topicId : that.data.topicId,
              anonymous : that.data.anonymous,
              to : []
           },function(res){
              that.clearComment(that); 
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
              that.setData({submitDisabled : false});
           },function(err){
               that.clearComment(that); 
               console.log(err);
               that.setData({submitDisabled : false});
           });
          }
        });
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
    bindinput : function(e){
       this.setData({content : e.detail.value}); 
    },
    atUser : function(e){
       var atUsername = e.target.dataset.username;
       if(atUsername == '@匿名用户'){
          return;
       }
       if(new RegExp(atUsername).test(this.data.content)){
          return; 
       }
       this.setData({content : this.data.content + ' ' + atUsername + ' '});
    },
    deleteTopic : function(e){
       wx.showModal({
          title: '删除确认',
          content: '确认删除该话题?',
          success: function(res) {
              if (res.confirm) {
                  var topicid = e.target.dataset.topicid;
                  utils.serviceUtil.post(conf.service.deleteTopic,{
                     sessionId : app.globalData.sessionId,
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
    deleteComment : function(e){
      var that = this;   
      wx.showModal({
          title: '删除确认',
          content: '确认删除该评论?',
          success: function(res) {
              if (res.confirm) {
                  var commentid = e.target.dataset.commentid;
                  var index = e.target.dataset.index;
                  utils.serviceUtil.post(conf.service.deleteComment,{
                     sessionId : app.globalData.sessionId,
                     commentId : commentid,
                     topicId : that.data.topicId
                  },function(res){
                     that.data.comments.splice(index,1);
                     that.setData({comments : that.data.comments});
                  },function(err){
                     console.log(err);
                  });
              }
          }       
      });
    }
});