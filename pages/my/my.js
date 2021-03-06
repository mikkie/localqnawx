var app = getApp(),
util = require('../../utils/util'),
conf = require('../../utils/conf');
Page({
    data : {
        tab0 : "tab",
        tab1 : "tab lowlight",
        tab2 : "tab lowlight",
        index : "0",
        newComment : false,
        myTopics : [],
        joinTopics : [],
        atMeTopics : []
    },
    loadMyTopic : function(that){
       util.serviceUtil.get(conf.service.findTopicsByOwner,{
           sessionId : wx.getStorageSync('sessionId')
       },function(res){
            var find = false;
            that.setData({myTopics : res.data.success});
            if(res.data.success && res.data.success.length > 0){
               for(var i = 0;i < res.data.success.length; i++){
                   if(res.data.success[i].newComment && res.data.success[i].newComment > 0){
                       find = true;
                       break;
                   }
               }
            }
            that.setData({newComment : find});
       },function(err){
            console.log(err);
       }); 
    },
    loadMyReplies : function(that){
       util.serviceUtil.get(conf.service.findUserRepliesTopics,{
           sessionId : wx.getStorageSync('sessionId')
       },function(res){
            that.setData({joinTopics : res.data.success});
       },function(err){
            console.log(err);
       }); 
    },
    loadAtMe : function(that){
       util.serviceUtil.get(conf.service.findAtmeTopics,{
           sessionId : wx.getStorageSync('sessionId')
       },function(res){
            that.setData({atMeTopics : res.data.success});
       },function(err){
            console.log(err);
       }); 
    },
    onShow : function(){
        var that = this;
        app.login(function(){
           that.loadAllData(that);
        });
    },
    onPullDownRefresh : function(){
      this.loadAllData(this);
      wx.stopPullDownRefresh(); 
    },
    loadAllData : function(that){
       that.loadMyTopic(that); 
       that.loadMyReplies(that); 
       that.loadAtMe(that); 
    },
    loadData : function(that){
       switch(that.data.index){
          case "0" : that.loadMyTopic(that); break;
          case "1" : that.loadMyReplies(that); break;
          case "2" : that.loadAtMe(that); break;
          default : that.loadMyTopic(that); break;   
       }  
    },
    changeTab : function(e){
       var index = e.target.dataset.index; 
       for(var i = 0; i < 3; i++){    
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
           tab2 : this.data.tab2,
           index : index
       }); 
       this.loadData(this);
    }
});