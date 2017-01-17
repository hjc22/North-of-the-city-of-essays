const {Mongo,MongoCt,newID} = require('/www/html/api/mongo');
const {log,space,xss,login} = require('/www/html/api/public');
const {openRedis,setRedis,getRedis,closeRedis}=require('/www/html/api/redis');

const cmtAdd = async(...args) => {
    try {
        let [data, req, res] = args;

        let loginInfo = await login(req, res);   //判断登录
        if (!loginInfo) return ({
            code: 10,
            err: '没有登录'
        })

        loginInfo=JSON.parse(loginInfo);

        let aid=parseInt(space(data.aid)),
            type=space(data.type),
            cmt=space(data.cmt);

        if (!aid) return {
            code: 2,
            err: 'id错误'
        }
        if (!parseInt(aid)) return {
            code: 2,
            err: '非法请求'
        }
        if (!type) return {
            code: 2,
            err: '类型错误'
        }



        const [db, cmtCT] = await Mongo('artCmt'),
              users=MongoCt(db,'users'),idsCT=MongoCt(db,'ids');

        let addCon = await newID(idsCT,{idName:'cid'});//评论id递增

        const userInfo=await users.findOne({uid:loginInfo.uid});//查询用户信息

        let cmtExp={  //评论信息模版对象
            user: userInfo.name,
            userImg: userInfo.userImg,
            twocmt: [],
            time: new Date().getTime(),
            cmtText: cmt,
            id:addCon.cid
        }

        log(aid)
        if(type==1){ //如果是评论第一层级
              cmtExp.twoNum=0;
              cmtCT.updateOne({aid},{$push:{cmtList:cmtExp}});
              const art=MongoCt(db,'content');

              art.updateOne({articleID:Number(aid)},{$inc:{cmt:1}});


        }
        else if(type==2){ //如果是评论第二层级
              let cmtIndex=space(data.cmtIndex);
              delete cmtExp.twocmt;
              if(!cmtIndex) return {
                  code: 2,
                  err:'层级定位错误'
              }
              let cmtName='cmtList.'+cmtIndex+'.twocmt';
              cmtCT.updateOne({aid},{$push:{[cmtName]:cmtExp}})
              cmtCT.updateOne({aid},{$inc:{['cmtList.'+cmtIndex+'.twoNum']:1}})
        }


        db.close();


        return {code: 1,data: cmtExp}



    } catch (e) {
        log(e);
        return {
            code: 2,
            err: '服务出错，请稍后再试...'
        }
    }
}

module.exports = cmtAdd;
