const {Mongo,MongoCt}=require('/www/html/api/mongo');
const {log,space} = require('/www/html/api/public');

const findCmtList = async (...args)=>{
        try{
            let [data,req,res] = args,type=space(data.type),aid=Number(space(data.aid));

            if(!data.aid) return {code:2,err:'id错误'}
            if(!parseInt(data.aid)) return {code:2,err:'非法请求'}
            if(!type) return {code:2,err:'层级错误'}

            const [db,cmt]=await Mongo('artCmt'),types=type==1?0:1;

            let cmtName='cmtList.twocmt',find;

            if(types){
                let cmtIndex=space(data.cmtIndex);
                if(!cmtIndex) return {
                    code: 2,
                    err:'层级定位错误'
                }
                let arr=[Number(cmtIndex),1];
                find=await cmt.findOne({aid},{cmtList:{$slice:arr},[cmtName]:1,_id:0});
                find=find.cmtList[0];
            }
            else{
                find=await cmt.findOne({aid},{[cmtName]:types,_id:0});
            }




            return {code:1,data:find}
        }
        catch(e){
            log(e);
            return {code:2,err:'服务出错，请稍后再试...'}
        }
}

module.exports=findCmtList;
