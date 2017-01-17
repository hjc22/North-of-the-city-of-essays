
HJC技术博客


原生Node.js开发的后台 使用的mongodb作为数据库，redis作为session缓存;


没有使用express，koa的原因就是想做一个在不重启node进程的情况下动态加载模块,动态路由;


使用了ES7的async和await做回调控制，node v7.0以上支持async和await语法，需要命令上加上--harmony参数;


使用PM2作为进程管理;