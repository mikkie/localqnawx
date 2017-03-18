var app = getApp();
var utils = require('../../utils/util.js');
var conf = require('../../utils/conf.js');
Page({
  data:{
    periodArray : ['5分钟','1小时','4小时','24小时','7天'],
    periodIndex : 2,
    currentLoc : '',
    communityId : '',
    content : '',
    expireLengths : ['5','1','4','24','7'],
    expireDateUnits : ['m','h','h','h','d'],
    anonymous : false,
    photoes : []
  },
  confirmContent : function(e){
     this.data.content = e.detail.value;
  },
  toggleAnonymous : function(e){
     this.setData({anonymous: e.detail.value});
  },
  listenerPeriodSelected: function(e) {
      this.setData({
        periodIndex: e.detail.value
      });
  },
  submitTopic : function(e){
     var that = this;
     if(utils.stringUtil.isEmptyOrNull(this.data.communityId) || utils.stringUtil.isEmptyOrNull(this.data.currentLoc) || utils.stringUtil.isEmptyOrNull(this.data.content)){
         return;
     }
     app.getUserInfo(function(userInfo){
        if(userInfo){
          utils.serviceUtil.post(conf.service.createNewTopic,{
              userInfo : userInfo,
              content : that.data.content,
              sessionId : wx.getStorageSync('sessionId'),
              communityId : that.data.communityId,
              communityName : that.data.currentLoc,
              expireLength : that.data.expireLengths[that.data.periodIndex],
              expireDateUnit : that.data.expireDateUnits[that.data.periodIndex],
              anonymous : that.data.anonymous
           },function(res){
              if(res.data["401"]){
                 wx.showModal({
                   title: '无权限',
                   content: res.data["401"],
                   showCancel : false       
                 });
              }
              else{
                 //uploadImages
                 if(res.data.success && that.data.photoes.length > 0){
                    that.uploadImages(res.data.success,that);
                 }
                 wx.navigateBack({delta: 1}) 
              }
           },function(err){
               console.log(err);
           });
        }
     });

  },
  initUpload : function(){
     var aliupload = wx.getStorageSync('aliupload');
     if(!aliupload || !aliupload.expire || aliupload.expire < new Date().getTime()){
        utils.serviceUtil.post(conf.service.getUploadSignature,{},function(res){
          if(res.data.success){
             wx.setStorageSync('aliupload',res.data.success);   
          }
        });
     }
  },
  onLoad : function(options){
       this.setData({currentLoc : options.curLocl,communityId : options.communityId});
       this.initUpload();
  },
  pickPic : function(){
    var that = this;
    wx.chooseImage({
      count: 9, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
         // 返回选定照片的本地文件路径列表，tempFilePath可以作为img标签的src属性显示图片
         if(that.data.photoes.length < 9){
            if(res.tempFilePaths && res.tempFilePaths.length > 0){
               for(var i in res.tempFilePaths){
                  that.data.photoes.push(res.tempFilePaths[i]);
               } 
               that.setData({photoes : that.data.photoes});
            }
         }
      }
    });
  },
  previewPic : function(e){
    var that = this;
    var index = e.currentTarget.dataset.index;
    if(that.data.photoes[index]){
      wx.previewImage({
        urls: [that.data.photoes[index]] 
      });
    }
  },
  removePic : function(e){
    var index = e.currentTarget.dataset.index;
    this.data.photoes.splice(index,1);
    this.setData({photoes : this.data.photoes});
  },
  get_suffix : function(filename) {
    var pos = filename.lastIndexOf('.')
    var suffix = ''
    if (pos != -1) {
        suffix = filename.substring(pos)
    }
    return suffix;
  },
  generateRandomFileName : function(path,that){
      var number = utils.stringUtil.random_string(32);
      var subfix = that.get_suffix(path);
      return number + subfix;
  },
  uploadImages : function(topic,that){
     var aliupload = wx.getStorageSync('aliupload');
     if(aliupload && aliupload.expire && aliupload.expire > new Date().getTime()){
       console.log(JSON.stringify(aliupload));
       var photoes = that.data.photoes;
       var yyyyMMdd = utils.formatTimeyyyyMMdd(new Date());
       for(var i = 0; i < photoes.length;i++){
          var key =  [aliupload.dir,yyyyMMdd,that.generateRandomFileName(photoes[i],that)].join('/'); 
          wx.uploadFile({
            url: aliupload.host, 
            filePath: photoes[i],
            name: 'file',
            formData:{
              'key' : key,
              'policy': aliupload.policy,
              'OSSAccessKeyId': aliupload.accessid, 
              'success_action_status' : '200', 
              'signature': aliupload.signature,
            },
            success: function(res){
              var data = res.data
            },
            fail : function(err){
               console.log(err);
            }
          }); 
       } 
     }
  } 
})