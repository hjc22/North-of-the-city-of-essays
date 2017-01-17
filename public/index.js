const Xss=require('xss');

const public={
      xss(data){
          if(typeof data !== 'object') return new Error('no object')
          for(let i in data){
              data[i]=Xss(data[i])
          }
          return data
      },
      log(a){
          console.log(a)
      }
}



module.exports=public
