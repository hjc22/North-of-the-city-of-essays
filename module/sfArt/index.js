const {Mongo,MongoCt}=require('../../mongo');
const request=require('request');
const fs = require('fs');
const cheerio = require('cheerio');

const findArtInfo = async (data)=>{
        try{
            let url='https://segmentfault.com/blogs/hottest';

            const sfhtml=await Req('get',url);

            let $ = cheerio.load(sfhtml);

            let new_item=[],num=1;

            $('.summary').each(function(i,item){
                  new_item.push({title:$(this).find('.title a').text().trim(),url:'https://segmentfault.com'+$(this).find('.title a').attr('href'),author:$(this).find('.author a').eq(0).text().trim(),address:$(this).find('.author a').eq(1).text().trim(),i:num++})
            })

            return {code:1,data:new_item}
        }
        catch(e){
            console.log(e);
            return {code:2,err:'服务出错，请稍后再试...'}
        }
}

module.exports=findArtInfo;




const Req = (method, url) => new Promise((resolve, reject) => {
    request({
        method,
        url,
        header: {}
    }, (err, req, body) => {
        if(!err){
            resolve(body)
        }
        else{
            reject(err)
        }
    })
})
