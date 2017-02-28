var app = getApp(),
util = require('../../utils/util'),
conf = require('../../utils/conf');
Page({
    data : {
        tab0 : "tab",
        tab1 : "tab lowlight",
        tab2 : "tab lowlight",
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
    },
    changeTab : function(e){
       var index = e.target.dataset.index; 
       for(var i = 0; i < 2; i++){         
        //   if(i == index){
        //       this.setData({'tab' + i : 'tab'});
        //   }
        //   else{
        //       this.data[tab + i] = "tab lowlight";
        //   }   
       }  
    }
});