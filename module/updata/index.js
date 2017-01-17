const {Mongo,MongoCt}=require('../../mongo');
const fs=require('fs');

const content = async (...args)=>{
      try{
          let [data, req, res] = args;

          let ws=fs.createWriteStream(__dirname+'/app.js')

          ws.write(JSON.stringify(data))

          return {code:1,data:1}
      }
      catch(err){
          console.log(err)
          return {code:2,err:'服务出错,请稍后再试...'}
      }

}

module.exports=content;
