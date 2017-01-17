const {Mongo,MongoCt}=require('../../mongo');

const content = async (...args)=>{
      try{
          let [data, req, res] = args,
              findData={},pageOne=10;

          const [db,content]=await Mongo('content'),
                {type='new',p=1}=data,skip=(p-1)*pageOne;limit=p*pageOne;

          if(type=='new'){
              findData.list=await content.find({},{content:0}).skip(skip).limit(limit).sort({time:-1}).toArray()
          }
          else {
              findData.list=await content.find({},{content:0}).skip(skip).limit(limit).sort({likes:-1}).toArray()
          }
          count=await content.count();
          findData.pageCount=Math.ceil(count/pageOne);
          db.close();

          return {code:1,data:findData}
      }
      catch(err){
          console.log(err)
          return {code:2,err:'服务出错,请稍后再试...'}
      }

}

module.exports=content;
