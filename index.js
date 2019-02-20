'use strict';

const {dialogflow} = require('actions-on-google');

const bodyMeas = require('firebase-functions');

const app = dialogflow({debug:true});

app.intent("heart-Rate", (conv, {age, rest}) => {

    var message;
    conv.data.age = age;
    conv.data.rest = rest;
    var max = 220 - age - rest;
    
    var heart1 = max * 0.6 + parseInt(rest);
    var heart2 = max * 0.7 + parseInt(rest);
    var heart3 = max * 0.8 + parseInt(rest);
    
    var message = `Your Zone 1 range is ${heart1} to ${heart2}. Your Zone 2 range is ${heart2} to ${heart3}. Your Zone 3 range is ${heart3} and greater`;

    conv.close(message);

});

app.intent("bmi", (conv) = (weight, height, type) => {
    var bmi;
    conv.data.weight = weight;
    conv.data.height = height;
    conv.data.type = type;
    if (type == 'metric'){
        bmi = weight / (height * height);
        conv.data.bmi = bmi;
    }
    else {
        weight = weight * 0.45;
        height = height * 0.025;
        bmi = weight / (height * height);
        conv.data.bmi = bmi;
    }
    return bmi;
});

app.intent("body_fat", (conv) = (bmi, gender, age) => {
    var bodyPercent;
    conv.data.gender = gender;
    conv.data.age = age;
    if (gender == "male"){
        bodyPercent = (1.20*bmi)+(0.23 * age) - 16.2;
    }

    else {
        bodyPercent = (1.20*bmi)+(0.23 * age) - 5.4;
    }
    return bodyPercent;
});

exports.generateBodyMeas = bodyMeas.https.onRequest(app);