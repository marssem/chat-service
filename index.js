var http = require('http');
var express = require('express');
var db = require('./db');

var app = express();


app.use(express.static('public'));
app.use(express.json());

// 챗봇을 처음 켰을 때, 처음으로 나오는 지금까지 채팅한 내용
app.get('/get',(req,res)=>{
	db.get(res);
});

// db에 저장된 질문 목록 가져오기
app.get('/getQuestion',(req,res)=>{
	db.getQuestion(res);
});

// db에 질문을 넣고, 해당 질문에 대한 답이 db에 있으면 질문과 값을 같이 반환
app.post('/sendQuestion',(req,res)=>{
	db.sendQuestion(res, req.body.word);
});




app.listen(80, ()=>{
	console.log('server working!');
});

