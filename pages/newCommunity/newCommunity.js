var utils = require('../../utils/util.js')
Page({
  data: {
    currentLoc : '选择位置',
    communityName : ''
  },
  openMap : function(event){
      var that = this;   
      wx.chooseLocation({
          success : function(obj){
             that.setData({currentLoc : obj.name});
          }
      });
  },
  submitNewCommunity : function(){
      if(this.data.currentLoc == '选择位置' || utils.stringUtil.isEmptyOrNull(this.data.communityName)){
         return false;
      }
      else{
          console.log('success');
      }
  }
});