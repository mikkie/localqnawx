var app = getApp(),
util = require('../../utils/util'),
conf = require('../../utils/conf');
Page({
    data : {
        tab0 : "tab",
        tab1 : "tab lowlight",
        communities : [],
        topics : []
    },
    loadStarCommunities : function(that){
       util.serviceUtil.get(conf.service.findStarCommunitiesByOwner,{
           sessionId : wx.getStorageSync('sessionId')
       },function(res){
            that.setData({communities : res.data.success});
            that.setData({topics : []});
       },function(err){
            console.log(err);
       }); 
    },
    loadStarTopics : function(that){
       util.serviceUtil.get(conf.service.findStarTopicsByOwner,{
           sessionId : wx.getStorageSync('sessionId')
       },function(res){
            that.setData({topics : res.data.success});
            that.setData({communities : []});
       },function(err){
            console.log(err);
       });
    }, 
    handleCommunityStar : function(e){
        var index = e.currentTarget.dataset.index;
        this.data.communities.splice(index,1);
        this.setData({communities : this.data.communities});
        util.serviceUtil.post(conf.service.toggleStarCommunity,{
           communityId : e.currentTarget.dataset.communityid,
           isAdd : 'false', 
           sessionId : wx.getStorageSync('sessionId')
        },function(res){
            //that.setData({communities : res.data.success});
        },function(err){
            console.log(err);
        });
    },
    handleTopicStar : function(e){
        var index = e.currentTarget.dataset.index;
        this.data.topics.splice(index,1);
        this.setData({topics : this.data.topics});
        util.serviceUtil.post(conf.service.toggleStarTopic,{
            topicId : e.currentTarget.dataset.topicid,
            isAdd : 'false', 
            sessionId : wx.getStorageSync('sessionId')
        },function(res){
            //that.setData({communities : res.data.success});
        },function(err){
            console.log(err);
        });
    },
    onShow : function(){
        var that = this;
        app.login(function(){
           that.loadStarCommunities(that);
        });
    },
    changeTab : function(e){
       var index = e.target.dataset.index; 
       for(var i = 0; i < 2; i++){    
          var key = 'tab' + i;      
          if(i == index){  
              this.data[key] = 'tab';
          }
          else{
              this.data[key] = 'tab lowlight';
          }   
       } 
       this.setData({
           tab0 : this.data.tab0,
           tab1 : this.data.tab1,
           tab2 : this.data.tab2
       }); 
       switch(index){
          case "0" : this.loadStarCommunities(this); break;
          case "1" : this.loadStarTopics(this); break;
          default :  break;   
       }
    }
});