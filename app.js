var express = require('express'),
 app = express(),
 cookieParser = require('cookie-parser');
//var saveip=requre('./ipAPI.js');

var session = require('express-session')

app.set('port', process.env.PORT || 80);

/*app.set('view engine', 'html');//默认使用模板
app.engine('html', require('ejs').__express);
app.set('views', __dirname + '/view');*/

app.use(express.static(__dirname + '/static'));//设置静态文件 请求加载位置
/*

Cookie   And Session


*/
app.use(session({
	secret:'key word',
	resave:false,
	saveUninitialized:true
}));
//模板加载
app.use(cookieParser());//使用cooking


app.get('/',function(req,res){
	res.sendfile('./static/login.html');
});
var user_router=require('./router/user.js');
app.use('/user',user_router);
app.use('*',function(req,res){
	res.send('Error 404');
});

app.listen(app.get('port'));
console.log('This server start...');