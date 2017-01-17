const {openDbCt,openCT,findHasVal,updateDT}=require('../../mongo');
const fn=require('../../public');




function getUserInfo() {

    return new Promise((resolve, reject) => {
        let [data, req, res] = arguments;
        fn.login(req, res).then(dt => {

            if (!dt) return resolve({
                code: 10,
                err: '没有登录'
            })
            let userInfo = JSON.parse(dt)



            return toFindUser(userInfo);
        }).then(dt => resolve(dt))

    })

}

function ccc(){
    console.log(1111)
}

const toFindUser = (userInfo) => {
    return new Promise((resolve, reject) => {
        if (!userInfo.uid) return resolve({
            code: 2,
            err: 'id错误'
        })
        if (!Number(userInfo.uid)) return resolve({
            code: 2,
            err: '非法请求'
        })

        fn.log(userInfo)

        let opendb = openDbCt('mongodb://localhost:27017/hjcblog', 'users')


        opendb.then(dt => updateDT(dt,[{uid:{$gt:0}},{$set:{postNum:0}}],'all',1)).then(dt=>{return resolve({code:1,data:1})})




    })

}

module.exports=getUserInfo;
