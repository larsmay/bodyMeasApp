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
    
    message = `Your Zone 1 range is ${heart1} to ${heart2}. Your Zone 2 range is ${heart2} to ${heart3}. Your Zone 3 range is ${heart3} and greater. Would you like to know anything else?`;

    conv.ask(message);

});

app.intent("bmi", (conv) = () => {
    var bmi;
    var message;
    console.log("I need height and weight");
    let weight = conv.data.weight;
    
    let height = conv.data.height;
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
    message = `Your bmi is ${bmi}. Would you like to know anything else?`;

    conv.ask(message);
    
});

app.intent("body_fat", (conv) = (bmi, gender, age) => {
    var bodyPercent;
    var message;
    conv.data.gender = gender;
    conv.data.age = age;
    if (gender == "male"){
        bodyPercent = (1.20*bmi)+(0.23 * age) - 16.2;
    }

    else {
        bodyPercent = (1.20*bmi)+(0.23 * age) - 5.4;
    }
    message = `Your Body Fat percentage is ${bodyPercent} percent.  Would you like to know anything else?`;

    conv.ask(message);
});

exports.generateBodyMeas = bodyMeas.https.onRequest(app);