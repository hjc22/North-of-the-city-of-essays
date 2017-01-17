const {Mongo,MongoCt}=require('/www/html/api/mongo');
const {log,space,getClientIp} = require('/www/html/api/public');

const artLike = async (data,req,res)=>{
        try{

            let aid=Number(space(data.aid)),ip=getClientIp(req);
            if(!aid) return {code:2,err:'id错误'}
            if(!parseInt(data.aid)) return {code:2,err:'非法请求'}


            const [db,content]=await Mongo('content'),artLikes=MongoCt(db,'artLikes');

            const likeRe=await artLikes.updateOne({aid},{$addToSet:{ips:ip}});

            if(likeRe.result.nModified){
                content.updateOne({articleID:aid},{$inc:{likes:1}});
                return {code:1,data:1}
            }
            return {code:2,err:'亲，您已经点赞过了，感谢您的支持！'}
        }
        catch(e){
            log(e);
            return {code:2,err:'服务出错，请稍后再试...'}
        }
}

module.exports=artLike;
