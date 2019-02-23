'use strict';

const {dialogflow} = require('actions-on-google');

const bodyMeas = require('firebase-functions');

const app = dialogflow({debug:true});

app.intent("heart-Rate", (conv) => {

    var message;
    let age = conv.data.age;
    let rest = conv.data.rest;

    if(!age && !rest){
        conv.ask("Please provide your age and resting heart rate.");
    }
    else if(!age){
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

app.intent("bmi", (conv) => {
    var message;
    var bmi;
    let weight = conv.data.weight;

    let height = conv.data.height;
    let type = conv.data.type; 

    if (!weight && !height && !type) {
        conv.ask("To calculate your B M I, I need you to provide the type in metric or imperial, your weight, and your height");
    } else if (!weight) {
        conv.ask("Please provide your weight");
    } else if (!height) {
        conv.ask("Please provide height in inches or pounds");
    } else if (!type) {
        conv.ask("Please provide the measurement type in imperial or metric");
    } else {
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
    }


   
    
});

app.intent("body_fat", (conv) => {
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

exports.generateBodyMeas = bodyMeas.https.onRequest(app);