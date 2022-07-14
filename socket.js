import  WebSocket, { WebSocketServer } from "ws";

const wss = new WebSocketServer({port:3000});

wss.on("connection", ws =>{

    ws.on("message",(data, isBinary )=>{

        wss.clients.forEach((client)=>{
            if(client.readyState === WebSocket.OPEN){
                let date = getDate();
                
                client.send(`{"data" : ${data}, "date" :"${date}"}`,{binary:isBinary})
            }
        })
        //console.log(`Received data : ${data}`);
        //ws.send(`Received data : ${data}`);
    });
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

