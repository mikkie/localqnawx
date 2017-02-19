Page({
  data:{
    periodArray : ['5分钟','1小时','4小时','24小时','7天'],
    periodIndex : 0
  },
  listenerPeriodSelected: function(e) {
      this.setData({
        periodIndex: e.detail.value
      });
  }, 
})