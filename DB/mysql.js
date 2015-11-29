var mysql = require ('mysql'),
    dataconf=require ('../config/mysql-config.js'),

    pool = mysql.createPool({
		host : dataconf.host,
		user : dataconf.user,
		password : dataconf.password,
		database : dataconf.database,
		prefix : dataconf.prefix
	});

exports.query = function (sql,callback,inser){
	pool.getConnection(function(err,connection){
		if (err){
			console.log('获取数据库连接错误！');
			if (callback){
				callback("获取数据库连接错误！");
			}
		}else {
			console.log(sql);
			connection.query(sql,function (err,result){
				if (err){
					console.log(err);
					console.log("执行sql语句错误！");
					if (callback){
						callback("执行sql语句错误！");
					}
				}else if (result){
					if (callback){						
						callback(err,result);
						console.log('返回result成功！');
					}					
				}
				
			})
			connection.release();
		}
	})
}
