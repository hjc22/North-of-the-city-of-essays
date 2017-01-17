
const test = require('assert')
const MongoClient = require('mongodb').MongoClient;

let mongo = {};

mongo.Mongo = async (ct) => {
    try {
        const db = await MongoClient.connect('mongodb://localhost:27017/hjcblog');
        const collection = db.collection(ct);
        return [
            db,
            collection
        ]
    } catch (e) {
        console.log(e)
    }
}

mongo.MongoCt =(db,ct) => {
    try {
        const collection = db.collection(ct);
        return collection
    } catch (e) {
        console.log(e)
    }
}


mongo.insertDT= async (dts,tmp,close)=>{
    try{
        const ids=await mongo.MongoCt(dts.db,'ids');

        const incDt=await mongo.newID(ids,tmp);

        let idname=incDt.idName;
        delete incDt.idName;

        const id=dts.collection.insert(incDt,{safe:true});

        return incDt[idname]
    }
    catch(e){
        console.log(e);
        return '服务出错，请稍后再试...'
    }

}

mongo.newID=(collection,tmp)=>{

     return new Promise((resolve,reject)=>{
        collection.findAndModify({_id:tmp.idName}, [], {$inc:{[tmp.idName]:1}},{new:true,upsert:true},(err,obj)=>{
               if(!err){
                  tmp[tmp.idName]=obj.value[tmp.idName];
                  resolve(tmp)
               }
               else{
                  console.log('自增失败:'+err);
                  reject('自增失败')
               }
        });

     })
}


module.exports = mongo;
