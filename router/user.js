var express = require('express');
var app='';
var router = express.Router();
router.setApp=function(app_){app=app_;}
var querystring=require('querystring');
var mysql = require ('../DB/mysql.js');
var querystring=require('querystring');
router.all('*',function(req,res,next){
	//res.send('zhegeshishenma?')
	next();
})
/*router.all('*',function(req,res,next){
	if (req.session.admin == null ){
		res.sendfile('./views/admin_login.html');
	}else{
		next();
	}
})*/
var setCookie=function(req,res,name){
	if (req.cookies.name) {
    	console.log('来访用户'+req.cookies.name);
  	} else {
    	res.cookie('name', name, {maxAge: 60 * 1000});
  	}
};
router.get('/name/:name',function(req,res,next){
	var name=req.params.name;
	if (name) setCookie(req,res,name);
	else res.send('非法访问');
	mysql.query("select name from user where name='"+name+"'",function(err,result){
		if(result[0]&&result[0].name) {
			res.send({info:'用户名存在',statu:1})

		}
		else res.send({info:'用户名不存在',statu:0});
	})
});
router.post('/name',function(req,res,next){
	var name=req.cookies.name;
	if(name){
		req.addListener('data',function(data){
			zdata=data.toString();
			var requestPost=querystring.parse(zdata);
			var sql ="select name,password from user where name='"+name+"' and password='"+requestPost.pwd+"'";
			mysql.query(sql,function(err,result){
				if(result[0]&&result[0].name) {
					res.send({info:'登陆成功',statu:1});
				}
				else res.send({info:'密码错误',statu:0});
			})
		});
	}else{
		res.send({statu:0})
	}
})
router.post('/adduser',function(req,res,next){
	var name=req.cookies.name;
	if(name){
		req.addListener('data',function(data){
			zdata=data.toString();
			var requestPost=querystring.parse(zdata);
			var sql ="insert into user (name,password) values('"+name+"','"+requestPost.pwd+"')" ;
			mysql.query(sql,function(err,result){
				if(result.affectedRows == '1'){
					res.send({info:'注册成功登陆成功',statu:1});
				}
				//console.log('----insert---->'+result.affectedRows+'-----'+result.insertId);
				else res.send({statu:0})
			})
		});
	}else{
		res.send({statu:0})
	}
})
module.exports=router;