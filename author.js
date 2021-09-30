/*
  get Methods

//引入express框架    
const express = require('express');
//创建网站服务器
const app = express();
app.get('/index', (req, res) => {
    //获取请求参数  通过query获取
    res.send(req.query);
});
//端口监听
app.listen(3000);
console.log('服务器启动成功');
===================================================================\



const express = require('express');
const bodyParser = require('body-parser');
//创建网站服务器
const app = express();

//请求的参数中必须有这些参数
app.get('/index/:id/:name/:age', (req, res) => {
    //接受post请求参数 使用req.param
    res.send(req.params)
});
//端口监听
app.listen(3000);





post Methods

//引入body-parser模块
const bodyParser = require('body-parser');
//配置body-parser模块


app.use(bodyParser.urlencoded({ extended: false}));
app.use(bodyParser.json()) 
//接受请求
app.post('/add',(req, res) =>{
	//接受请求参数
	console.log(req.body);
})





链接数据库
var mysql      = require('mysql');
var connection = mysql.createConnection({
    host:'47.97.102.88',
	user:'root',
	password:'123456',
	database:'studentDB'
});

db.connect();



条件查询：

SELECT * FROM 'studentSroce' where openid='openid'  返回 数组

插入 

INSERT INTO 'studentSroce' ( name,age,sex,score,openid )  VALUES ('name','age','score','openid')



*/









const  express =require('express')

const app = express()


const  axios = require('axios')


const mysql = require('mysql')

const bodyParser = require('body-parser');



//微信开发者服务器address ：GET https://api.weixin.qq.com/sns/jscode2session?appid=APPID&secret=SECRET&js_code=JSCODE&grant_type=authorization_code
const loginObj={
	APPID:'wx69399ea97c8d9cfd',
	APPSecret:'dabcaeacc96c5b0b3ce30097ccd9bc72',
	js_code:'',
	grant_type:'authorization_code',

}


var db = mysql.createConnection({

	host:'47.97.102.88',
	user:'root',
	password:'123456',
	database:'studentDB'
})
db.connect();
app.get('/xcx/login', function (req, res) {
	// console.log("req=>:",req.headers)
	// console.log("================================>")
	console.log("req=>:",req.query)
	loginObj.js_code = req.query.code;
	axios.get(`https://api.weixin.qq.com/sns/jscode2session?appid=${loginObj.APPID}&secret=${loginObj.APPSecret}&js_code=${loginObj.js_code}&grant_type=js_code=${loginObj.grant_type}`)
	  .then(loginRes => {
	    var mysql = `SELECT * FROM studentSroce where openid ='${loginRes.data.openid}'`
	    var  response={
						statusCode:200,
						msg:"ok",
						// data:[],
						data:''
					}
	    db.query(mysql,function(err,reslut){
	    	
	    	if(err){console.log('mysql=  ======err=>',err);return false}
	    	console.log('mysql=  ======reslut=>',reslut)

	    	response.data=reslut[0]

	    	if(reslut.length==0){
	    		var addMysql = `INSERT INTO  studentSroce (name,age,sex,score,openid) VALUES ('default','0','1',89,'${loginRes.data.openid}')`
	    		db.query(addMysql,function(addErr,addReslut){
	    			if(addErr){console.log("addErr=====================>",addErr); return }

	    			console.log("addReslut=====================>",addReslut)
	    			db.query(mysql,function(err,reslut){

						if(err){console.log('mysql=  ======err=>',err);return false}
						console.log("reslut========================",reslut)
	    				response.data=reslut[0]

	    				res.header("Access-Control-Allow-Origin", "*");
					    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
					    res.header("Access-Control-Allow-Headers", "X-Requested-With");
					    res.header('Access-Control-Allow-Headers', 'Content-Type');
			   			res.send(response);


	    			})

	    		})

	    	}else{
		    	res.header("Access-Control-Allow-Origin", "*");
			    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
			    res.header("Access-Control-Allow-Headers", "X-Requested-With");
			    res.header('Access-Control-Allow-Headers', 'Content-Type');
	   			res.send(response);
	    	}
	    	
	    })


	  })
  	.catch(loginError => {
    	console.error(loginError)
  	})		
})

app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json()) 
app.post('/subMessage',(req,res)=>{
	
	// let [ openid,userName,userAge] = req.body
	let openid = req.body.openid
	let userName = req.body.userName
	let userAge = req.body.userAge

	console.log("接受请求参数 req=>",openid,userName,userAge)
	let tableName = `studentSroce`

	// var updateSql ="UPDATE `studentSroce` SET `name`='"+userName+"' ,`age`="+userAge+"  WHERE openid ='"+openid+"'"

	var updateSql =`UPDATE ${tableName} SET name='${userName}',age=${userAge} WHERE openid = '${openid}'`
	console.log("updateSql==================>",updateSql)

 	db.query(updateSql,function(UpdateErr,UpdateResult){
 		if(UpdateErr){
 			console.log("UpdateErr ==================================>",UpdateErr)
 			return false
 		}
 		console.log("UpdateResult ===========================>",UpdateResult)
 		var  response={
						statusCode:200,
						msg:"ok",
						// data:[],
						data:'提交成功'
					}
	res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "X-Requested-With");
    res.header('Access-Control-Allow-Headers', 'Content-Type');
	res.send(response);
 	})
})


 
var server = app.listen(8084, function () {
 
  var host = server.address().address
  var port = server.address().port
 
  console.log("应用实例，访问地址为 http://%s:%s", host, port)
 
})