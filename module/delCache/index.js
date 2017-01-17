const fn=require('../../public');


console.log(fn)
const getLogin = async (...args) => {

    let [data,req,res]=args;
    const login = await fn.login(req, res)

    if (!login) return ({
        code: 10,
        err: '没有登录'
    })
    let userInfo = JSON.parse(login)
    fn.delCache()
    return {code:1,data:1};
}


module.exports=getLogin;
