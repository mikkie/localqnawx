//index.js
var conf = require('conf');

function formatTime(date) {
  var year = date.getFullYear()
  var month = date.getMonth() + 1
  var day = date.getDate()

  var hour = date.getHours()
  var minute = date.getMinutes()
  var second = date.getSeconds()


  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

function formatNumber(n) {
  n = n.toString()
  return n[1] ? n : '0' + n
}

var stringUtil = {
   isEmptyOrNull : function(str){
      if(!str){
         return true;
      }
      return str.test(/\s+/);
   }
};

var serviceUtil = {
  post : function(url,data,success,fail){
     wx.request({
              url: conf.host + url, 
              data: data,
              method : 'post',
              header: {
                'content-type': 'application/json'
              },
              dataType : 'json',
              success: function(res) {
                 success(res);
              },
              fail : function(err){
                 if(typeof fail === 'function'){
                     fail(err);
                 }
              }
            });  
  }
};

module.exports = {
  formatTime: formatTime,
  stringUtil : stringUtil,
  serviceUtil : serviceUtil
}
