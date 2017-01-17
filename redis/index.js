
const redis = require("redis")

const redisTool={
    openRedis(){
         return new Promise((resolve,reject)=>{
            client = redis.createClient(6379,'127.0.0.1',{});
            client.on("error", function (err) {
                 console.log("Error " + err);
            });
            resolve(client)
         })

    },
    getRedis(client,key,close){
        return new Promise((resolve,reject)=>{
           client.get(key, function(err, reply) {
               if(err || !reply){
                  resolve(false)
               }
               else{
                  console.log(reply.toString());
                  resolve({reply,client})
               }
               if(close) client.quit()
      	   });
        })
    },
    delRedis(client,key,close){
        return new Promise((resolve,reject)=>{
           client.del(key, function(err, reply) {
               if(err || !reply){
                  resolve(false)
               }
               else{
                  console.log(reply.toString());
                  resolve({reply,client})
               }
               if(close) client.quit()
      	   });
        })
    },
    setRedis(client,key,value,close,time){
        return new Promise((resolve,reject)=>{
           client.set(key,value,function(err, reply) {
             if(err){
                console.log('err:'+err)
             }else{
                console.log(reply.toString());
                resolve({reply,client})
                if(time) client.expire(key, time);
             }
    		     if(close) client.quit()
    	     });
        })
    }
}

module.exports = redisTool;
