var MongoClient = require('mongodb').MongoClient;
var url = "mongodb://localhost:27017/";

const user = [ 'user1', 'user2', 'user3'];

module.exports = {
	get : function(res){

		MongoClient.connect(url, function(err, db) {
			if (err) throw err;

			var dbo = db.db("chat");
			dbo.collection(user[0]).find({}).toArray(function(err, result) {
				if (err) throw err;
				db.close();
				return res.send(result);
			});
		});

	},
	insert : function (res,word) {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			var date = new Date();
			const insertData = {
				word : word,
				date : date.getFullYear().toString() 
					+ '-' 
					+ addOne(date.getMonth() + 1) 
					+ '-' 
					+ addOne(date.getDate()) 
					+ 'T'
					+ addOne(date.getHours()) 
					+ ':' 
					+ addOne(date.getMinutes()) 
					+ ':' 
					+ addOne(date.getSeconds()),
				status : 'question'
			}
			var dbo = db.db("chat");
			dbo.collection(user[0]).insertOne(insertData,function (err, _res) {
				if(err) throw err;
				res.send(JSON.stringify({'response': insertData}));
				db.close();
			});
		});
		
	},
	getQuestion : function ( res) {
		
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;

			var dbo = db.db("chat");
			dbo.collection("answer").find({}).toArray(function(err, result) {
				if (err) throw err;
				db.close();
				return res.send(result);
			});
		});
	},
	sendQuestion : function (res,question) {
		
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;

			var dbo = db.db("chat");
			
			dbo.collection("answer").findOne({question:question},function (dberr, dbres) {
				if(dberr) throw dberr;

				const questionData = convertQuestion(question);
				if (dbres) {
					const questionAndAnswerData = convertQuestionAnswer(questionData, dbres.answer);
					insertQuestionAnswer(res, db, dbo, questionAndAnswerData);

				}else{
					dbo.collection("answer").find({question:{'$regex':question}}).toArray(function (_dberr, _dbres) {
						if(_dberr) throw _dberr;
						if ( _dbres.length > 0) {
							// const questionAndAnswerData = convertQuestionAnswer(questionData, _dberr.answer);

							// insertQuestionAnswer(res, db, dbo, questionAndAnswerData);
							isInsertQuestionAnswerList(res, db, dbo, questionData, convertAnswerList(_dbres));
						}else{

							insertQuestion(res, db, dbo, questionData);
						}
					})

				}

			});
		});
	},
	getTalk : function (client, str, user) {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			let dbo = db.db("chat");
			dbo.collection("talk").find({}).toArray(function (dberr, dbres) {
				if (dberr) throw dberr;
				console.log(dbres);
				client.send(JSON.stringify(dbres) );
				
			});
		})

	},
	fetchTalk : function (client,data,isBinary, user) {
		MongoClient.connect(url, function(err, db) {
			if (err) throw err;
			let dbo = db.db("chat");
			dbo.collection("talk").insertOne(JSON.parse(data), function (_err, result) {
				// console.log(JSON.stringify(result));	
                client.send(JSON.stringify(result),{binary:isBinary})
			})
		})
	}

} 

// 질문만 디비에 넣는 함수
function insertQuestion(res, db, dbo, questionData) {
	let value = null;
	
	dbo.collection(user[0]).insertOne(questionData,function (dberr, dbres) {
		if(dberr) throw dberr;

		db.close();
		res.send( value = JSON.stringify({'question': questionData,'answer':'none'}));

	});

}

function isInsertQuestionAnswerList(res, db, dbo, questionData, answerList) {
	let value = null;
	
	dbo.collection(user[0]).insertMany([questionData,answerList],function (dberr, dbres) {
		if(dberr) throw dberr;

		db.close();
		res.send( value = JSON.stringify({'question': questionData,'answer':answerList}));

	});

}

// // 답변 리스트만 디비에 넣는 함수
// function insertAnswer(res,  db, dbo, answerData) {
	
// }

function convertAnswerList(array) {
	let list = new Array;
	var date = new Date();

	array.forEach(element => {
		list.push(element);
	});

	return {
		word : list,
		date : date.getFullYear().toString() 
				+ '-' 
				+ addOne(date.getMonth() + 1) 
				+ '-' 
				+ addOne(date.getDate()) 
				+ 'T'
				+ addOne(date.getHours()) 
				+ ':' 
				+ addOne(date.getMinutes()) 
				+ ':' 
				+ addOne(date.getSeconds()),
		status : 'answer'
	}


	
}

// 질문과 답변을 디비에 넣는 함수
function insertQuestionAnswer(res, db, dbo, questionAndAnswerData) {

	let value = null;
	
	dbo.collection(user[0]).insertMany(questionAndAnswerData,function (_dberr, _dbres) {
		if(_dberr) throw _dberr;

		db.close();
		res.send( value = JSON.stringify({'question': questionAndAnswerData[0],'answer':questionAndAnswerData[1]}));
	});

}

function convertAnswer(answer) {
	
	var date = new Date();
	return {
		word : answer,
		date : date.getFullYear().toString() 
				+ '-' 
				+ addOne(date.getMonth() + 1) 
				+ '-' 
				+ addOne(date.getDate()) 
				+ 'T'
				+ addOne(date.getHours()) 
				+ ':' 
				+ addOne(date.getMinutes()) 
				+ ':' 
				+ addOne(date.getSeconds()),
		status : 'answer'
	}
}

// 질문과 답변을 디비에 넣을 수 있도록 변환하는 함수
function convertQuestionAnswer(question,answer) {
	var array = new Array;
	var date = new Date();

	array[0] = question;
	array[1] = {
		word : answer,
		date : date.getFullYear().toString() 
				+ '-' 
				+ addOne(date.getMonth() + 1) 
				+ '-' 
				+ addOne(date.getDate()) 
				+ 'T'
				+ addOne(date.getHours()) 
				+ ':' 
				+ addOne(date.getMinutes()) 
				+ ':' 
				+ addOne(date.getSeconds()),
		status : 'answer'
	};

	return array;
}

// 질문을 디비에 넣을 수 있도록 변환하는 함수
function convertQuestion(question) {
	var date = new Date();
	return {
		word : question,
		date : date.getFullYear().toString() 
				+ '-' 
				+ addOne(date.getMonth() + 1) 
				+ '-' 
				+ addOne(date.getDate()) 
				+ 'T'
				+ addOne(date.getHours()) 
				+ ':' 
				+ addOne(date.getMinutes()) 
				+ ':' 
				+ addOne(date.getSeconds()),
		status : 'question'
	}
	
}

// 숫자가 한 자리 수일 경우 앞에 0을 더해주는 함수
function addOne(params) {
	var params = params.toString();
	if(params.length === 1){
		return '0'+params;
	}
	return params;
}

