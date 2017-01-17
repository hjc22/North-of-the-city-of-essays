const {Mongo,MongoCt}=require('../../mongo');
const cookies=require('cookie');
const {openRedis,setRedis,getRedis,closeRedis}=require('../../redis');
const fn=require('../../public');

const login=async (...args)=>{
      try{
           let [data,req,res]=args;

           const [db,users]=await Mongo('users');

           const userInfo=await users.findOne({name:data.name});

           if(!userInfo) return {code:5,err:'用户名或密码错误'};
           if(userInfo.password !== data.password) return {code:5,err:'用户名或密码错误'};

           let redisUserInfo=JSON.stringify(userInfo),
               cookieTime=60*60*24*3,
               rkey=userInfo._id.toString();

           const redis=await openRedis();

           setRedis(redis,rkey,redisUserInfo,1,cookieTime)

           let date=new Date(),
               expiresDays=3;
           date=new Date(date.setTime(date.getTime()+expiresDays*24*3600*1000));

           res.setHeader('Set-Cookie', cookies.serialize('session_id',rkey, {
              domain:'dnixiao.com',
              maxAge: cookieTime,
              path:'/',
              overwirte:true
           }))

           return {code:1,data:userInfo.uid}
     }
     catch(e){
          fn.log(e)
          return {code:2,err:'服务出错，请稍后再试...'}
     }

}

module.exports=login;
