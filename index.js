'use strict';

var AWS = require('aws-sdk'),
  documentClient = new AWS.DynamoDB.DocumentClient();


exports.handler = function(event, context, callback) {
  // TODO implement
  console.log(event);
  var params = {
    TableName: "CC_user_bot_data",
  };
  var response = {
    statusCode: 200,
    body: JSON.stringify('This is contact center bot API!'),
  };
  var param = event.queryStringParameters;

  switch (event.httpMethod) {
    case 'GET':
      {
        if (param.phone == null) {
          response.statusCode = 400;
          response.body = JSON.stringify('Please pass the phone number of the user !');
          callback(null, response);
        }
        else {
          if (param.content_type == null) {
            params = {
              TableName: "CC_user_bot_data",
              FilterExpression: "#phone_number = :phone_number_val",
              ExpressionAttributeNames: {
                "#phone_number": "phone_number",
              },
              ExpressionAttributeValues: { ":phone_number_val": param.phone },
              Limit: 1,
              ScanIndexForward: false
            };
            console.log(params);
            documentClient.scan(params, function(err, data) {
              if (err) {
                response.body = JSON.stringify(err);
              }
              else {
                response.body = JSON.stringify(data.Items);
              }
              callback(null, response);
            });

          }
          else {
            params = {
              TableName: "CC_user_bot_data",
              FilterExpression: "#phone_number = :phone_number_val",
              ExpressionAttributeNames: {
                "#phone_number": "phone_number",
              },
              ExpressionAttributeValues: { ":phone_number_val": param.phone }
            };
            console.log(params);
            documentClient.scan(params, function(err, data) {
              if (err) {
                response.body = JSON.stringify(err);
              }
              else {
                response.body = JSON.stringify(data.Items);
              }
              callback(null, response);
            });


          }
        }

        break;
      }
    case 'POST':
      {
        console.log(event.body);
        param = JSON.parse(event.body);
        console.log(param);
        console.log(param.phone);
        console.log(param.chat_id);
        console.log(param.conversation);
        if(param.phone == null || param.chat_id == null || param.conversation == null) {
          response.statusCode = 400;
          response.body = JSON.stringify('Phone number or the chat id or converstion is missing from the request body');
          callback(null, response);
        }
        else {
          var timestamp = new Date().getTime();
          params = {
            Item: {
              "chat_id":param.chat_id,
              "phone_number":param.phone,
              "conversation":param.conversation,
              "time_stamp":timestamp
            },
            TableName: "CC_user_bot_data"
          };
          documentClient.put(params, function(err, data) {
            if(err){
              response.body = JSON.stringify('Something went wrong call the F***ING Developer');
            }else{
              response.body = JSON.stringify('data inserted to db');
            }
          callback(null, response);
          });
        }
      }
  }

};
