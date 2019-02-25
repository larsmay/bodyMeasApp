'use strict';

const {dialogflow} = require('actions-on-google');

const bodyMeas = require('firebase-functions');

const app = dialogflow({debug:true});

app.intent("userRequestsHeart", (conv) => {

    var message;
    let age = conv.parameters['age'];
    let rest = conv.paramenters['rest'];

    if(!age){
        conv.ask("Please provide your age");
    }
    else if(!rest){
        conv.ask("Please provide your resting heart rate");
    }
    else {
        var max = 220 - age - rest;
    
        var heart1 = max * 0.6 + parseInt(rest);
        var heart2 = max * 0.7 + parseInt(rest);
        var heart3 = max * 0.8 + parseInt(rest);
    
        message = `Your Zone 1 range is ${heart1} to ${heart2}. Your Zone 2 range is ${heart2} to ${heart3}. Your Zone 3 range is ${heart3} and greater. Would you like to know anything else?`;

        conv.ask(message);

    }
    

});

app.intent("heartRate",(conv) => {
    var message;
    let age = conv.parameters['age'];
    conv.data.age = age;

    let rest = conv.parameters['rest'];
    conv.data.rest = rest;

    var max = 220 - age - rest;
    
    var heart1 = max * 0.6 + parseInt(rest);
    var heart2 = max * 0.7 + parseInt(rest);
    var heart3 = max * 0.8 + parseInt(rest);
    
    message = `Your Zone 1 range is ${heart1} to ${heart2}. Your Zone 2 range is ${heart2} to ${heart3}. Your Zone 3 range is ${heart3} and greater. Would you like to know anything else?`;

    conv.ask(message);
});

app.intent("userRequestsBMI", (conv) => {
    var message;
    var bmi;
 
    let weight = conv.data.weight;
    console.log("Weights value: "+weight);
    let height = conv.data.height;
    console.log("Heights value: "+height);
    let type = conv.data.type;
    if (!type) {
        conv.ask("Please provide the measurement type in imperial or metric");
    } else if (!height) {
        conv.ask("Please provide height in inches");
    } else if (!weight) {
        conv.ask("Please provide your weight in pounds");
    } else {
        if (type == 'metric'){
            bmi = weight / (height * height);
            conv.data.bmi = bmi; //this sucks
        }
        else {
            weight = weight * 0.45;
            height = height * 0.025;
            bmi = weight / (height * height);
            conv.data.bmi = bmi;

            
        }
        message = `Your bmi is ${bmi}, based on previous submitted values. Would you like to know anything else?`;

        conv.ask(message);
    }
});

app.intent("bmi",(conv) => {
    var message;
    console.log();
    let type = conv.parameters['type'];
    conv.data.type = type;
    let height = conv.parameters['height']['amount'];
    conv.data.height = height;
    console.log();
    let weight = conv.parameters['weight']['amount'];
    conv.data.weight = weight;
    console.log();
    
    

    let bmi;
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

app.intent("userRequestsBodyFat", (conv) => {
    var bodyPercent;
    var message;
    let gender = conv.data.gender;
    let age = conv.data.age;
    let bmi = conv.data.bmi;

    if (!age && !gender) {
        conv.ask("To compute your body fat percentage I need your age and gender");
    }
    else {
        if (gender == "male"){
            bodyPercent = (1.20*bmi)+(0.23 * age) - 16.2;
        }

        else {
            bodyPercent = (1.20*bmi)+(0.23 * age) - 5.4;
        }
        message = `Your Body Fat percentage is ${bodyPercent} percent.  Would you like to know anything else?`;

        conv.ask(message);
    }

    
});

    app.intent("body_fat", (conv) => {
        let bmi = conv.data.bmi;
        let gender = conv.parameters['gender'];
        conv.data.gender = gender;
        let age = conv.parameters['age'];
        conv.data.age = age;
        var bodyPercent;

        if (gender == "male"){
            bodyPercent = (1.20*bmi)+(0.23 * age) - 16.2;
        }

        else {
            bodyPercent = (1.20*bmi)+(0.23 * age) - 5.4;
        }

        var message = `Your Body Fat percentage is ${bodyPercent} percent.  Would you like to know anything else?`;

        conv.ask(message);
    });
exports.generateBodyMeas = bodyMeas.https.onRequest(app);