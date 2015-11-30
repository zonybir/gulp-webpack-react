var React = require ('react');
var ajax = require ('./ajax.js');
module.exports=React.createClass({
	getInitialState:function(){
		return {
			like:false,
			signIn:true,
			showErr:false,
			err_info:'',
			b:''
		};
	},
	date:{
		userName:''
	},
	handleInput:function(e){
		this.date.userName=e.target.value;		
	},
	handleNextStep:function(){
		var t=this;
		if(!this.date.userName) this.setState({showErr:true,err_info:'Please entry your name.' });
		else {
			ajax.GET('user/name/'+t.date.userName+'?date='+new Date(),function(result){
				if(result.statu == '1') {
					if(!t.state.signIn){
						t.setState({showErr:true,err_info:'用户名已存在！'});
					}else{
						t.setState({showErr:false,err_info:'',b:true});
						t.render=t.pwd;
					}
				}else{
					if(!t.state.signIn){
						t.setState({showErr:false,err_info:''});
						t.render=t.pwd;
					}else t.setState({showErr:true,err_info:result['info']})
				}
			});
		}
	},
	handSignUp:function(e){		
		this.setState({showErr:false});
		this.state.signIn?this.setState({signIn:false}):this.setState({signIn:true});
	},
	passwordKey:{
		key:[],
		status:false,
		endStatus:true,
		setKey:function(key){
			this.key.push(key);
		},
		hasKey:function(key){
			if(this.key.some(function(item,index,arry){
				return item == key;
			})) 
			return true;
			else{
				this.setKey(key);
				return false;
			}
		}
	},
	handlePwdNext:function(e){
		if(!this.passwordKey.status) return;
		
		if(this.passwordKey.hasKey(e.target.getAttribute('value'))) return;
		else {
			this.lineDate.startPoint={
				x:e.pageX,
				y:e.pageY
			};
			var firstKey=parseInt(e.target.getAttribute('value'),10),
			col=Math.ceil(firstKey/3)-1,
			row=firstKey-(col*3+1),
			x=row*120+30,
			y=col*120+30;
			this.lineDate.canvasPoint={
				x:x,
				y:y
			}
			this.lineDate.path.push(this.lineDate.canvasPoint);
			
		}
		//console.log(this.passwordKey.key);
		
	},
	handlePwdStart:function(e){
		if (this.passwordKey.endStatus) this.passwordKey.endStatus=false;
		else return;
		this.canvasInit();
		this.passwordKey.status=true;
		this.passwordKey.hasKey(e.target.getAttribute('value'));
		this.lineDate.startPoint={
			x:e.pageX,
			y:e.pageY
		};
		var firstKey=parseInt(e.target.getAttribute('value'),10),
		col=Math.ceil(firstKey/3)-1,
		row=firstKey-(col*3+1),
		x=row*120+30,
		y=col*120+30;
		this.lineDate.canvasPoint={
			x:x,
			y:y
		};
		this.lineDate.path.push(this.lineDate.canvasPoint);
		this.lineDate.context.moveTo(x,y);
		//console.log(e.pageX+'---'+e.pageY);
		
	},
	handleResetPwd:function(){
		if(this.passwordKey.status) this.passwordKey.status=false;
		else return;
		this.lineDate.context.closePath();
		this.lineDate.context.clearRect(0,0,300,300);

		this.lineDate.context.beginPath();
		this.lineDate.beforLine();
		this.lineDate.context.stroke();

		//模拟 ajax 验证密码
		var t=this,data={};
		console.log(t.passwordKey.key.toString().replace(',',''));
		data="pwd="+t.passwordKey.key.toString().replace(/\,/g,'');
		console.log(data);
		ajax.POST('user/name?data='+new Date(),data,function(result){
			if(result.statu == '1'){
				alert(result.info);
			}else{
				alert(result.info);
				t.passwordKey.endStatus=true;
				t.lineDate.context.closePath();
				t.lineDate.context.clearRect(0,0,300,300);
				t.passwordKey.key=[];
				t.lineDate.path=[];
			}
		})
	},
	lineDate:{
		context:'',
		startPoint:{
			x:0,
			y:0
		},
		canvasPoint:{
			x:0,
			y:0
		},
		path:[],
		beforLine:function(){
			var t=this;
			this.path.map(function(key,index,arry){
				t.context.lineTo(key.x,key.y);
			})
		},
		drawLine:function(x,y){
			this.context.closePath();
			this.context.clearRect(0,0,300,300);
			this.context.beginPath();
			this.beforLine();
			this.context.moveTo(this.canvasPoint.x,this.canvasPoint.y);
			this.context.lineTo(x,y);
			this.context.stroke();
		}
	},
	handleDrawLine:function(e){
		if (!this.passwordKey.status) return;
		var bx=e.pageX - this.lineDate.startPoint.x,
		by=e.pageY - this.lineDate.startPoint.y;
		var x=bx+this.lineDate.canvasPoint.x;
		var y=by+this.lineDate.canvasPoint.y;
		this.lineDate.drawLine(x,y);
	},
	render:function(){
		var display = this.state.showErr ? 'show' : 'hide',
		rule={};
		rule= this.state.signIn?{placeholder:'please input zony',title:'without',signAs:'sign up',btn_text:'Next'}:{placeholder:'sign up name',title:'hava a',signAs:'sign in',btn_text:'Sign Up'};
		return (
			<div className='login-box'>
				<input onChange = {this.handleInput} onBlur={this.handleNextStep} placeholder={rule.placeholder}/>
				<button onClick={this.handleNextStep}>{rule.btn_text}</button>
				<div ><span className={display}>{this.state.err_info}</span></div>
				<p><span>{rule.title} account ?</span><span onClick={this.handSignUp} className='sign-sa'>{rule.signAs}</span></p>
			</div>
		);
	},
	canvasInit:function(){
		var c=this.lineDate.context=document.getElementById('pwdLine').getContext("2d");
		c.strokeStyle='#f00';
		c.fillStyle='#ccc';
		c.lineWidth='10';
	},
	pwd:function(){
		var key=[1,2,3,4,5,6,7,8,9],t=this;
		return(
			<div className='login-box pwd-box' onMouseUp={this.handleResetPwd} onMouseMove={this.handleDrawLine} onMouseLeave={this.handleResetPwd}>
				{key.map(function(value,index,arry){
					return <span className='prohibitSelect' key={value} onMouseEnter={t.handlePwdNext} onMouseDown={t.handlePwdStart} value={value}></span>
				})}
				<canvas  id='pwdLine' width='300px' height='300px'>your mus update your brower wo continue use.</canvas>
			</div>
		)
	}
});