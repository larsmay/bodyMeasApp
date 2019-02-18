'use strict';

const {dialogflow} = require('actions-on-google');

const bodyMeas = require('firebase-functions');

const app = dialogflow({debug:true});

app.intent("bodyMeas", (conv, {weight, height, type, gender, age}) => {

    var message;
    let bodyMass = bmi(weight, height, type);
    let bodyFat = body_fat(bodyMass, gender, age);

    message = `Your bmi is ${bodyMass} and your body fat percent is ${bodyFat}.`;

    conv.close(message);

});

app.intent("bmi", (conv) = (weight, height, type) => {
    var bmi;
    if (type == 'metric'){
        bmi = weight / (height * height);
    }
    else {
        weight = weight * 0.45;
        height = height * 0.025;
        bmi = weight / (height * height);
    }
    return bmi;
});

app.intent("body_fat", (conv) = (bmi, gender, age) => {
    var bodyPercent;

    if (gender == "male"){
        bodyPercent = (1.20*bmi)+(0.23 * age) - 16.2;
    }

    else {
        bodyPercent = (1.20*bmi)+(0.23 * age) - 5.4;
    }
    return bodyPercent;
});

exports.generateBodyMeas = bodyMeas.https.onRequest(app);