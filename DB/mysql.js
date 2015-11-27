var mysql = require ('mysql'),
    dbconf=require ('../config/mysql-config.js'),

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
						//console.log(result.length)
						if (inser == 1){//   BUG 1  当打印内容被清空后  throw ERR   服务器中断 也就是index为null时
						if (result[0].index){
							for (var i=0;i<result.length-1;i++){
								for (var j=i+1;j<result.length;j++){
									if (result[i].index > result[j].index){
										var t = result[i];
										result[i]=result[j];
										result[j]=t;
									}
								}
							}
						}
						}						
						callback(err,result);
						console.log('返回result成功！');
					}					
				}
				
			})
			connection.release();
		}
	})
}
