
window.addEventListener('load',function () {
    fetch('/get')
    .then(response =>{ return response.json(); })
    .then(result=>{
        showChatList(result,createChatItem);
    })
    .catch(err=>{
        console.log('Error : ', err);
    })
});
let ws = new WebSocket("ws://localhost:3000");
let sendForm = function (form) {
    if(!form.text.value){
        return false;
    }
    ws.send(chatData(form.text.value));
}

function chatData(text) {
    let obj = {
        status : 'consultant',
        word : text
    }

    return  JSON.stringify(obj);
}

ws.onmessage = function (event) {
    let data;
    try {
        data = JSON.parse(event.data); 
    } catch (error) {
        return;
    }
    console.log(data);
    showChatList(data,createChatItem);
}

function viewRecentChat() {
    let element = document.querySelector('.chat-container-wrap');
    let height = document.querySelector('#chatContainer').clientHeight;
   return element.scrollTo({'top':height});
}

// 채팅 아이템을 만들어 줌.
function createChatItem(direct, text) {
    let element = document.createElement('li');
    element.className = 'chat-item';
    if(direct === 'left'){
        element.className += ' left';
    }else{
        element.className += ' right';
    }
    element.innerHTML = `<div class="chat-item-text">${text}</div>`;
    return element;
}

function showChatList(obj,createChatItem) {
    let container = document.querySelector('#chatContainer');
    for (let key in obj) {
        if(obj[key] === 'none') return;
        container.appendChild(createChatItem((obj[key].status==='answer'?'right':'left'),obj[key].word));

        viewRecentChat()
    }

}

// input 안에 작성된 문자를 지움
function clearText() {
    document.querySelector('#sendText').value = '';
}