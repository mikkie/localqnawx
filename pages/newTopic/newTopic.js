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
    photoes : [],
    failedUpload : [],
    failedTry : 0,
    submitDisabled : false
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
     if(utils.stringUtil.isEmptyOrNull(this.data.communityId) || utils.stringUtil.isEmptyOrNull(this.data.currentLoc)){
         return;
     }
     var imageUrls = [];
     if(that.data.photoes && that.data.photoes.length > 0){
        var yyyyMMdd = utils.formatTimeyyyyMMdd(new Date());
        for(var i in that.data.photoes){
           var key = [yyyyMMdd,that.generateRandomFileName(that.data.photoes[i],that)].join('/');
           imageUrls.push(key); 
        }
     }
     if(utils.stringUtil.isEmptyOrNull(this.data.content) && imageUrls.length == 0){
         return;
     }
     app.getUserInfo(function(userInfo){
        if(userInfo){
          that.setData({submitDisabled : true,failedUpload : [],failedTry : 0});
          utils.serviceUtil.post(conf.service.createNewTopic,{
              userInfo : userInfo,
              content : that.data.content,
              sessionId : app.globalData.sessionId,
              communityId : that.data.communityId,
              communityName : that.data.currentLoc,
              expireLength : that.data.expireLengths[that.data.periodIndex],
              expireDateUnit : that.data.expireDateUnits[that.data.periodIndex],
              anonymous : that.data.anonymous,
              imageUrls : imageUrls,
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
                    that.uploadImages(imageUrls,that);
                 }
                 else{
                    wx.navigateBack({delta: 1}); 
                 }
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
       wx.setNavigationBarTitle({
         title: '新建话题-邻答'
       });
       this.setData({currentLoc : options.curLocl,communityId : options.communityId,photoes : []});
       this.initUpload();
  },
  pickPic : function(){
    var that = this;
    wx.chooseImage({
      count: 9 - that.data.photoes.length, // 默认9
      sizeType: ['original', 'compressed'], // 可以指定是原图还是压缩图，默认二者都有
      sourceType: ['album', 'camera'], // 可以指定来源是相册还是相机，默认二者都有
      success: function (res) {
        if(res.tempFilePaths && res.tempFilePaths.length > 0){
          for(var i in res.tempFilePaths){
            that.data.photoes.push(res.tempFilePaths[i]);
          } 
          that.setData({photoes : that.data.photoes});
        }
      }
    });
  },
  previewPic : function(e){
       var that = this;
       wx.previewImage({
           current : e.currentTarget.dataset.src,
           urls : that.data.photoes 
       });
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
  doUpload : function(i,aliupload,imageUrls,that){
     wx.showToast({
         title: '图片拼命上传中...',
         icon: 'loading',
         mask : true,
         duration: 10000
     }); 
     var photoes = that.data.photoes;
     var key =  [aliupload.dir,imageUrls[i]].join('/'); 
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
               console.log('upload image success:' + key);
               if(that.data.failedUpload.length > 0){
                  for(var j in that.data.failedUpload){
                     if(that.data.failedUpload[j] == imageUrls[i]){
                        that.data.failedUpload.splice(j,1);
                        break;  
                     } 
                  }
               }  
            },
            fail : function(err){
               console.log('upload image failed:' + key);
               if(that.data.failedUpload.length == 0){
                  that.data.failedUpload.push(imageUrls[i]);
               }
               else{
                  var find = false;  
                  for(var j in that.data.failedUpload){
                     if(that.data.failedUpload[j] == imageUrls[i]){
                        find = true;
                        break;  
                     } 
                  }
                  if(!find){
                     that.data.failedUpload.push(imageUrls[i]);
                  }
               }
               wx.showToast({
                 title: '网络不稳定，图片重新上传中....',
                 icon: 'loading',
                 mask : false,
                 duration: 3000
               });
            },
            complete : function(){
               wx.hideToast();
               if(i < photoes.length - 1){
                  that.doUpload(++i,aliupload,imageUrls,that); 
               }
               else{
                  if(that.data.failedUpload.length > 0){
                     if(that.data.failedTry < 3){
                        that.setData({failedTry : ++that.data.failedTry});
                        that.uploadImages(that.data.failedUpload.slice(0),that);  
                     }
                     else{
                        wx.showModal({
                           title: '错误',
                           content: '图片上传失败',
                           showCancel : false,
                           success: function(res) {
                             if (res.confirm) {
                                wx.navigateBack({delta: 1});
                             }
                            }
                        }); 
                     }
                  }
                  else{
                     wx.navigateBack({delta: 1});
                  }
               }
            }
          }); 
  },
  uploadImages : function(imageUrls,that){
     var aliupload = wx.getStorageSync('aliupload');
     if(aliupload && aliupload.expire && aliupload.expire > new Date().getTime()){
       that.doUpload(0,aliupload,imageUrls,that);
     }
  } 
})