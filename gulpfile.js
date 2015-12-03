var gulp = require ('gulp'),
       webpack = require ('webpack'),
       gutil = require ('gulp-util'),
       path = require ('path');

gulp.task('webpack',function(){
	webpack({
		//configuration
		entry:[path.resolve(__dirname,'dev/js/main.js')],
		output:{
			path:path.resolve(__dirname,'static/js'),
			filename:'build.js'
			},
		module: {
		  	 loaders: [{
		     			test: /\.js[x]?$/, // 用正则来匹配文件路径，这段意思是匹配 js 或者 jsx
		    		 	loader: 'jsx-loader' // 加载模块 "babel" 是 "babel-loader" 的缩写
		   		},
		   		{
		   			test:/\.less/,
		   			loader:'style!css!less'
		   		}
		   	]
		   }
	},function(err,stats){
		if (err) throw new gutil.PluginError('webpack',err);
		gutil.log(['webpack'],stats.toString({
			//output configuration
			
		}))
	})
})
gulp.task('start',function(){
	gulp.watch('dev/**/*.*',['webpack'])
})
gulp.task('default', ['start']);