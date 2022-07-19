
function sendQuestion(data, state, showChatList, createChatItem) {

    switch (state) {
        case 1:
            fetch('/sendQuestion',{
                method: 'POST',
                cache: 'no-cache',
                headers: {'Content-Type': 'application/json;charset=utf-8'},
                body : JSON.stringify(data)
            })
            .then(response =>{ return response.json(); })
            .then(result=>{
                showChatList(result,createChatItem);
            })
            .catch(err=>{
                console.log('Error : ', err);
            })
            break;
    
        default:
            break;
    }
    
}

window.addEventListener('load',function () {
    fetch('/get')
    .then(response =>{ return response.json(); })
    .then(result=>{
        showChatList(result,createChatItem);
    })
    .catch(err=>{
        console.log('Error : ', err);
    })
})




function showChatList(obj,createChatItem) {
    let container = document.querySelector('#chatContainer');
    console.log(obj);
    for (let key in obj) {
        if(obj[key] === 'none') return;
        container.appendChild(createChatItem((obj[key].status==='answer'?'right':'left'),obj[key].word));

        viewRecentChat()
    }

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


class Question {

    showQuestionList = function (array, createQuestionLink, func) {
        let container = document.querySelector('#questionBox');
        for (let i = 0; i < array.length; i++) {
            container.appendChild(createQuestionLink(array[i].question,func));
        }
    }

    createQuestionLink = function(text,func) {
        let element = document.createElement('li');
        let anchor = document.createElement('a');
        anchor.href = '#none';
        anchor.addEventListener('click', func)
        anchor.innerText = text;
        element.appendChild(anchor);
        return element;
    }

    getHistory = function(showQuestionList, createQuestionLink, func) {
        fetch('getQuestion')
        .then(response =>{ return response.json(); })
        .then(result=>{
            console.log(result);
            showQuestionList(result, createQuestionLink, func);
        })
        .catch(err=>{
            console.log('Error : ', err);
        })
    }

    constructor(){

    }
}

const question = new Question();
question['selectedQuestion'] = function(e) {
    let data = {"word":e.target.text};
    sendQuestion(data, 1,showChatList, createChatItem);
}
question.getHistory(question.showQuestionList, question.createQuestionLink, question.selectedQuestion);



// input 안에 작성된 문자를 지움
function clearText() {
    document.querySelector('#sendText').value = '';
}

function viewRecentChat() {
    let element = document.querySelector('.chat-container-wrap');
    let height = document.querySelector('#chatContainer').clientHeight;
   return element.scrollTo({'top':height});
}


function toggleChatMode(element) {
    let questionBox = document.querySelector('#questionBox');
    if(element.dataset.mode === 'consultant'){
        element.innerText = '상담중...';
        element.dataset.mode = 'chatting';
        ws = new WebSocket("ws://localhost:3000");
        ws.onopen = function (event) {
            alert('상담원과 곧 연결됩니다.');
        }
    }else {
        element.innerText = '상담원 연결';
        element.dataset.mode = 'consultant';
        if (ws) { ws.close(); }
        console.log(ws);
    }
}
let ws;
let sendForm = function(form) {
    if(ws){
        if(!form.text.value){
            return false;
        }
        ws.send(JSON.stringify(chatData(form.text.value)));
        console.log(ws);
    }else{
        if(!form.text.value){
            return false;
        }
        let data = {word:form.text.value}
        sendQuestion(data, 1, showChatList, createChatItem);
    }
}


