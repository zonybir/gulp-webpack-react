var userName;    
var passWord;    
var xmlHttpRequest;    
    
    
//XmlHttpRequest对象    
function createXmlHttpRequest(){    
    if(window.ActiveXObject){ //如果是IE浏览器    
        return new ActiveXObject("Microsoft.XMLHTTP");    
    }else if(window.XMLHttpRequest){ //非IE浏览器    
        return new XMLHttpRequest();    
    }    
}    
    
function ajax(callback){    
   // userName = document.f1.username.value;    
    //passWord = document.f1.password.value;      
        
    //var url = "LoginServlet?username="+userName+"&password="+passWord+"";         
    //1.创建XMLHttpRequest组建    
    xmlHttpRequest = createXmlHttpRequest();    
        
    //2.设置回调函数    
    xmlHttpRequest.onreadystatechange =function(){    
        if(xmlHttpRequest.readyState == 4 && xmlHttpRequest.status == 200){    
            var result = xmlHttpRequest.responseText;
            result=eval('(' + result + ')')
            callback(result);
            //console.log(result);         
        }    
    } ;    
          
}       
    
    
//回调函数    
 
module.exports={
    GET:function(url,callback){
            ajax(callback);
    //3.初始化XMLHttpRequest组建    
            xmlHttpRequest.open("GET",url,true);    
        
    //4.发送请求    
            xmlHttpRequest.send(null);
    },
    POST:function(url,data,callback){
            ajax(callback);
            xmlHttpRequest.open("POST",url,true);      
            xmlHttpRequest.send(data);

    }
};