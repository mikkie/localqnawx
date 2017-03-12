var app = getApp(),
util = require('../../utils/util'),
conf = require('../../utils/conf');
Page({
    data : {
        tab0 : "tab",
        tab1 : "tab lowlight",
        tab2 : "tab lowlight",
        index : "0",
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
    loadMyReplies : function(that){
       util.serviceUtil.get(conf.service.findUserRepliesTopics,{
           sessionId : wx.getStorageSync('sessionId')
       },function(res){
            that.setData({topics : res.data.success});
       },function(err){
            console.log(err);
       }); 
    },
    loadAtMe : function(that){
       util.serviceUtil.get(conf.service.findAtmeTopics,{
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
           that.loadData(that);
        });
    },
    onPullDownRefresh : function(){
      this.loadData(this);
      wx.stopPullDownRefresh(); 
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