
const {Mongo,MongoCt}=require('../../mongo');
const fn=require('../../public');



const getUserInfo = async (...args) => {
    let [data, req, res] = args;
    const login = await fn.login(req, res)

    if (!login) return ({
        code: 10,
        err: '没有登录'
    })
    let userInfo = JSON.parse(login)

    return await toFindUser(userInfo);
}


const toFindUser = async userInfo => {
    if (!userInfo.uid) return {
        code: 2,
        err: 'id错误'
    }
    if (!Number(userInfo.uid)) return {
        code: 2,
        err: '非法请求'
    }
    try {
        let findData={};
        const [db,users] = await Mongo('users'),contents = MongoCt(db,'content');

        findData.info = await users.findOne({name: userInfo.name},{password:0,ip:0,_id:0})
        findData.articles = await contents.find({author: userInfo.name},{content:0}).toArray()
        db.close();
        return {code:1,data:findData}
    } catch (e) {
        fn.log(e)
        return {code:2,err:'服务错误，请稍后再试...'}
    }
}

module.exports=getUserInfo;
