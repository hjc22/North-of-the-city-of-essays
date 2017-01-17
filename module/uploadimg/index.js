const mongo=require('../../mongo');
const {openRedis,setRedis,getRedis,closeRedis}=require('../../redis');
const fn=require('../../public');
const request=require('request');
const fs = require('fs');
const url = require('url');


const upLoadImg= async (data,req,res)=>{
    try{
       let urlData = url.parse(req.url, true),type=urlData.query.type;
       if(type=='file'){

            copy(data,['/www/html/dist/app.js','/www/html/dist/vendor.js'])

            data.forEach(item=>{

                fs.unlinkSync(item)
              }
            )

            return ({code:1,data:data})
       }

       else if(type=='userImg'){


               let loginInfo = await fn.login(req, res);   //判断登录
               if (!loginInfo) return ({
                   code: 10,
                   err: '没有登录'
               })

               loginInfo=JSON.parse(loginInfo);

               copy(data,[`/www/html/static/userImg/${loginInfo.uid}.png`]);

               const [db,users]=await mongo.Mongo('users'),userImg=`http://112.126.92.103/static/userImg/${loginInfo.uid}.png`;


               users.updateOne({name:loginInfo.name},{$set:{userImg}},{upsert:true})

               db.close();



           return ({code:1,data:userImg})
       }
       else {
           const img=await forFn(data);
           return ({code:1,data:img});
       }

    }
    catch(e){
       fn.log(e)
       return ({code:2,err:'服务故障，请稍后再试...'})
    }

  }




const reqPost=formData=>new Promise((resolve,reject)=>{
     request.post({url:'http://open.taobao.com/upload.do',formData},function(err, req, body){
            if(err) return reject({code:2,err:err});
            let img='http:'+fn.dejson(fn.html_decode(body)).imgUrl;
            fs.unlinkSync(formData.Filedata.path);
            resolve(img)

     })
})

const forFn=a=>new Promise((resolve,reject)=>{
        let imgss=[];
        a.forEach(filepath=>{
             let formDatas={ Filedata: fs.createReadStream(filepath) }
             reqPost(formDatas).then(dt=>{imgss.push(dt);if(a.length==imgss.length) return resolve(imgss)})
        })

})


const copy=(src, dst)=>{
   try{
   	  for(let i in src){
   	  	  fs.createReadStream(src[i]).pipe(fs.createWriteStream(dst[i]));
   	  }

   }
   catch(e){
   	  console.log(e)
   }
}


module.exports=upLoadImg;
