const {Mongo,MongoCt,newID} = require('/www/html/api/mongo');
const {log,space,login} = require('/www/html/api/public');
const {openRedis,setRedis,getRedis,delRedis}=require('/www/html/api/redis');

const cookies=require('cookie');

const cookie=require('cookies');

const exit=async (...args)=>{
      try{
           let [data,req,res]=args,sessionId=cookie(req,res).get('session_id'),redis=await openRedis();

           delRedis(redis,sessionId,1)

           res.setHeader('Set-Cookie', cookies.serialize('session_id','', {
              domain:'112.126.92.103',
              maxAge: 0,
              path:'/',
              overwirte:true
           }))

           return {code:1,data:1}
     }
     catch(e){
          log(e)
          return {code:2,err:'服务出错，请稍后再试...'}
     }

}

module.exports=exit;
