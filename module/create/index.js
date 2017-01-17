const {Mongo,MongoCt,insertDT}=require('../../mongo');
const fn=require('../../public');
const marked=require('marked');
const highlight = require('highlight.js');

marked.setOptions({
    highlight: function (code) {
      return highlight.highlightAuto(code).value
    },
    renderer:new marked.Renderer(),
    gfm: true,
    tables: true,
    breaks: true,
    pedantic: false,
    sanitize: false,
    smartLists: true
});

let xxsOptions = {
  whiteList: {
    a:['href', 'title', 'target'],
    pre:['class'],
    p:[],
    br:[],
    strong:[],
    span:['class'],
    code:[],
    h3:['class'],
    blockquote:[],
    img:['src'],
  }
};


const insertArticle = async (...args)=>{
    let [data, req, res] = args;
    const login = await fn.login(req, res)

    if (!login) return ({
        code: 10,
        err: '没有登录'
    })
    let userInfo = JSON.parse(login)

    return await toInsertArticle(data,userInfo);


}


const toInsertArticle= async (data,userInfo)=>{

      try{
          if (!userInfo.uid) return {
              code: 2,
              err: 'id错误'
          }
          if (!Number(userInfo.uid)) return {
              code: 2,
              err: '非法请求'
          }
          if(!data.title) return {code:2,err:'没有文章标题'}
          if(!data.tags) return {code:2,err:'没有文章标签'}
          if(!data.content) return {code:2,err:'没有文章内容'}

          data.content=marked(data.content)

          data=fn.xss(data,xxsOptions)

          data.likes=data.cmt=0
          data.author=userInfo.name
          data.tags=data.tags.split(',')
          data.time=new Date().getTime()
          data.idName='articleID'

          const [db,content]=await Mongo('content');

          const isContent=await content.findOne({title:data.title});

          if(isContent) return {code:2,err:'已有相同标题的文章'}

          const id=await insertDT({db,collection:content},data);

          const users=MongoCt(db,'users'),
                cmts=MongoCt(db,'artCmt'),
                likes=MongoCt(db,'artLikes');

          users.updateOne({name:userInfo.name},{$inc:{postNum:1}},{upsert:true})

          cmts.insertOne({aid:id,cmtList:[]},{safe:true})

          likes.insertOne({aid:id,ipList:[]},{safe:true})

          db.close();

          return {code:1,data:id}
      }
      catch(e){
          console.log(e);
          return {code:2,err:'服务出错，请稍后再试...'}
      }




}

module.exports=insertArticle;
