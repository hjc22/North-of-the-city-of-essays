const {openDbCt,openCT,findHasVal,}=require('../../mongo');
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



let cc=6;
        async function responseTime() {
          const start = new Date();
          await cc-1;

          console.log(cc-3)
        }

        let opendb = openDbCt('mongodb://localhost:27017/hjcblog', 'users'),
            findData = {};

        opendb.then(dt => findHasVal(dt, [{
                name: userInfo.name
            }, {
                password: 0
            }], 'one'))
            .then(dt => {
                findData.info = dt.value;
                return openCT(dt.db, 'content')
            })
            .then(dt => findHasVal(dt, [{
                author: userInfo.name
            }, {
                content: 0
            }], 'find', 1))
            .then(dt => {
                findData.articles = dt.value;
                return resolve({
                    code: 1,
                    data: findData
                })
            })


    })

}

module.exports=getUserInfo;
