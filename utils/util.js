//index.js
var conf = require('conf');

var formatTimeyyyyMMdd = function(){
    var year = date.getFullYear();
    var month = date.getMonth() + 1;
    var day = date.getDate();
    return [year, month, day].map(formatNumber).join('');
};

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
      str = str.replace(/(^\s*)|(\s*$)/g, "")
      return str.length == 0;
   },
   random_string : function(len) {
　　  len = len || 32;
　　  var chars = 'ABCDEFGHJKMNPQRSTWXYZabcdefhijkmnprstwxyz2345678';   
　　  var maxPos = chars.length;
　　  var pwd = '';
　　  for (var i = 0; i < len; i++) {
    　　pwd += chars.charAt(Math.floor(Math.random() * maxPos));
      }
      return pwd;
   }
};

var serviceUtil = {
  post : function(url,data,success,fail){
     var app = getApp();
     app.showLoading();
     wx.request({
              url: conf.host + url, 
              data: data,
              method : 'post',
              header: {
                'content-type': 'application/json'
              },
              dataType : 'json',
              success: function(res) {
                 app.cancelLoading();
                 success(res);
              },
              fail : function(err){
                 app.cancelLoading(); 
                 console.log(err);
                 if(typeof fail === 'function'){
                     fail(err);
                 }
              }
     });  
  },
  "get" : function(url,data,success,fail){
     var app = getApp();
     app.showLoading();
     wx.request({
              url: conf.host + url, 
              data: data,
              method : 'get',
              header: {
                'content-type': 'application/json'
              },
              dataType : 'json',
              success: function(res) {
                 app.cancelLoading();
                 success(res);
              },
              fail : function(err){
                 app.cancelLoading();
                 console.log(err);
                 if(typeof fail === 'function'){
                     fail(err);
                 }
              }
     });
  }
};


var arrayUtil = {
  mergeArray : function(originArray,array){
     if(array && array.length > 0){
        for(var i in array){
           originArray.push(array[i]);
        }
     }
  }
};

module.exports = {
  formatTime: formatTime,
  stringUtil : stringUtil,
  serviceUtil : serviceUtil,
  arrayUtil : arrayUtil,
  formatTimeyyyyMMdd : formatTimeyyyyMMdd
}
