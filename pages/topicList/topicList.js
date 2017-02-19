Page({
    data : {
       currentLoc : "请选择位置"
    },
    onLoad : function(options){
       this.setData({currentLoc : options.curLocl});
    }
});