const Xss=require('xss');
const fs = require('fs');
const {openRedis,setRedis,getRedis,closeRedis}=require('./redis');
const cookies=require('cookies');
const formidable = require("formidable");
cacheList=[];
const public={
      xss(data,opt){
          if(typeof data !== 'object') return new Error('no object')
          for(let i in data){
              data[i]=Xss(data[i],opt)
          }
          return data
      },
      log(a){
          console.log(a)
      },
      setjsonp(res,code="200"){
          res.writeHead(code, {
                'Content-Type': 'text/json;charset=UTF-8',
                'Access-Control-Allow-Origin':'*',
                'Access-Control-Allow-Credentials':true,
              }
          );
      },
      getClientIp(req) {
        return req.headers['x-forwarded-for'] ||
        req.connection.remoteAddress ||
        req.socket.remoteAddress ||
        req.connection.socket.remoteAddress;
      },
      isObjectValue(a, b){
          var aProps = Object.getOwnPropertyNames(a);
          var bProps = Object.getOwnPropertyNames(b);
          if (aProps.length != bProps.length) {
              return false;
          }
          for (var i = 0; i < aProps.length; i++) {
              var propName = aProps[i];
              if (a[propName] !== b[propName]) {
                  return false;
              }
          }
          return true;
      },
      html_encode(str){
          let s="";
          if (str.length == 0) return "";
          s = str.replace(/&/g, "&gt;");
          s = s.replace(/</g, "&lt;");
          s = s.replace(/>/g, "&gt;");
          s = s.replace(/ /g, "&nbsp;");
          s = s.replace(/\'/g, "&#39;");
          s = s.replace(/\"/g, "&quot;");
          s = s.replace(/\n/g, "<br>");
          return s;
      },
      html_decode(str){
          var s = "";
          if (str.length == 0) return "";
          s = str.replace(/&gt;/g, "&");
          s = s.replace(/&lt;/g, "<");
          s = s.replace(/&gt;/g, ">");
          s = s.replace(/&nbsp;/g, " ");
          s = s.replace(/&#39;/g, "\'");
          s = s.replace(/&quot;/g, "\"");
          s = s.replace(/<br>/g, "\n");
          return s;
      },
      space(s){
          if(!s) return false;
          return s.replace(/\s+/g, '')
      },
      dejson(str){
          return JSON.parse(str)
      },
      toapi(data){
          let todata={};

          todata.code=data.code;

          if(data.code!=1){
              todata.err=data.err;
          }else{
              todata.data=data.data;
          }

          todata=JSON.stringify(todata)
          return new Promise((resolve,reject)=>{
            resolve(todata)
          })
      },
      delCache(){
         for(let i in global.cacheList){
             let d=global.cacheList;
             try{
                delete require.cache[require.resolve(d[i])]
             }
             catch(e){
                console.log(e)
             }
         }
      },
      toMoudle(modulePath,data,res,req){
          global.cacheList.push(modulePath)
          let moduleName=require(modulePath)
          moduleName(data,req,res).then(dt=>this.toapi(dt)).then(dt=>{
            this.delCache();
            this.setjsonp(res);res.end(dt)})
      },
      uploadimg(req,res,reqModuleName,urlData){
          let post={},file={},form=new formidable.IncomingForm();
          form.uploadDir = '/www/html/tmp';
          form.multiples = true;
          form
              .on('error', function(err) {
                  this.toapi({code:2,err:err}).then(dt=>res.end(dt))
              })
              .on('field', function(field, value) {
                  if (form.type == 'multipart') {  //有文件上传时 enctype="multipart/form-data"
                      if (field in post) { //同名表单 checkbox 返回array 同get处理
                          if (util.isArray(post[field]) === false) {
                              post[field] = [post[field]];
                          }
                          post[field].push(value);
                          return;
                      }
                  }
                  post[field] = value;
              })
              .on('file', function(field, file) { //上传文件
                  if(file.size>5000000) return this.toapi({code:2,err:'图片大小过大'}).then(dt=>res.end(dt))
                  file[field] = file;

              })
              form.parse(req,(err,field,files)=>{

                   if(files){
                       let filePath=[];
                       for(let i in files){
                           filePath.push(files[i].path)
                       }
                       this.toMoudle(reqModuleName,filePath,res,req)
                   }

              });
      },
      login(req,res){
          return new Promise((resolve,reject)=>{
              if(req.headers.cookie){
                  try {
                     let sessionId=cookies(req,res).get('session_id');
                     if(sessionId) return openRedis().then(db=>getRedis(db,sessionId,1)).then(dt=>resolve(dt.reply))
                  } catch (e) {
                  }
              }else{
                  return resolve(false)
              }
          })
      },
      JSONCookies(obj) {
        var cookies = Object.keys(obj);
        var key;
        var val;

        for (var i = 0; i < cookies.length; i++) {
          key = cookies[i];
          val = JSONCookie(obj[key]);

          if (val) {
            obj[key] = val;
          }
        }

        return obj;
      },
      rmString(randomFlag, min, max){
          let str = "",
          range = min,
          arr = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'a', 'b', 'c', 'd', 'e', 'f', 'g', 'h', 'i', 'j', 'k', 'l', 'm', 'n', 'o', 'p', 'q', 'r', 's', 't', 'u', 'v', 'w', 'x', 'y', 'z', 'A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'X', 'Y', 'Z'];

          // 随机产生
          if(randomFlag){
              range = Math.round(Math.random() * (max-min)) + min;
          }
          for(var i=0; i<range; i++){
              pos = Math.round(Math.random() * (arr.length-1));
              str += arr[pos];
          }
          return str;
      }
}


function JSONCookie(str) {
  if (typeof str !== 'string' || str.substr(0, 2) !== 'j:') {
    return undefined;
  }

  try {
    return JSON.parse(str.slice(2));
  } catch (err) {
    return undefined;
  }
}




module.exports=public
