Page({
    data : {
       currentLoc : "请选择位置",
       communityId : ''
    },
    onLoad : function(options){
       this.setData({currentLoc : options.curLocl,communityId : options.communityId});
    }
});