const {Mongo,MongoCt,insertDT}=require('../../mongo');
const fn=require('../../public');

async function register(...args){
    try{
         let [data,req]=args;
         let olddt=data;
         data=fn.xss(data);

         if(!fn.isObjectValue(olddt,data)) return {code:2,err:'含有非法字段，请更换用户名'}

         let pwdreg=/^[a-zA-Z]\w{5,17}$/,namereg=/.{3,10}/;
         if(!data.name) return {code:2,err:'没有用户名'}
         if(!data.password) return {code:2,err:'没有密码'}
         if(!namereg.test(data.name)) return {code:2,err:'用户名需要3-10个字符'}
         if(!pwdreg.test(data.password)) return {code:2,err:'密码需要以字母开头，长度在6-18之间，只能包含字符、数字和下划线'}

         data.idName='uid';
         data.postNum=0;
         data.userImg='http://112.126.92.103/static/img/face.svg';
         data.ip=fn.getClientIp(req);

         const [db,users]=await Mongo('users');

         const isUsers=await users.findOne({name:data.name});

         if(isUsers) return {code:2,err:'该用户名已经注册！'}

         const id=await insertDT({db,collection:users},data)

         return {code:1,data:id}
    }
    catch(e){
         console.log(e);
         return {code:2,err:'服务出错，请稍后再试...'}
    }



}

module.exports=register;
