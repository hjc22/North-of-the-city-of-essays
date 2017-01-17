const {Mongo,MongoCt}=require('../../mongo');


const findArtInfo = async (data)=>{
        try{
            if(!data.articleID) return {code:2,err:'没有文章ID'}
            let aid=parseInt(data.articleID)
            if(!aid) return {code:2,err:'非法请求'}

            const [db,content]=await Mongo('content');

            const find=await content.findOne({articleID:aid});

            return {code:1,data:find}
        }
        catch(e){
            console.log(e);
            return {code:2,err:'服务出错，请稍后再试...'}
        }
}

module.exports=findArtInfo;
