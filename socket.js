// import  WebSocket, { WebSocketServer } from "ws";
const { WebSocketServer, WebSocket } = require("ws"); 
const db = require("./db");

const wss = new WebSocketServer({port:3000});

wss.on("connection", (ws, req) =>{
    console.log('url : ', req.url);
    console.log('location : ', ws.location);

    wss.clients.forEach(client=>{
        db.getTalk(client, `새로운 유저가 접속했습니다. ${wss.clients.size}`);
        // client.send(`새로운 유저가 접속했습니다. ${wss.clients.size}`)
    })

    ws.on("message",(data, isBinary)=>{

        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN){
                let date = getDate();
                let str = `{"data" : ${data}, "date" :"${date}"}`;
                console.log('==============================================================');
                db.fetchTalk(client, str, isBinary);
                // client.send(str,{binary:isBinary})
            }
        })
    });


    ws.on("close", ()=>{
        wss.clients.forEach((client)=>{
            client.send(`유저 한 명이 떠났습니다. 현재 유저 ${wss.clients.size}`);
        })
    })

})

// 현재 시간을 형식에 맞게 리턴하는 함수
function getDate() {
    let date = new Date;

    return (
        date.getFullYear().toString() 
        + '-' 
        + addOne(date.getMonth() + 1) 
        + '-' 
        + addOne(date.getDate()) 
        + 'T'
        + addOne(date.getHours()) 
        + ':' 
        + addOne(date.getMinutes()) 
        + ':' 
        + addOne(date.getSeconds())
    )
}

// 숫자가 한 자리 수일 경우 앞에 0을 더해주는 함수
function addOne(params) {
	var params = params.toString();
	if(params.length === 1){
		return '0'+params;
	}
	return params;
}

