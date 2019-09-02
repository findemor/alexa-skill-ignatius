/* eslint-disable  func-names */
/* eslint-disable  no-console */
const I18N = require('./i18n.js');
const SoundsManager = require('./SoundsManager.js');
const aplTemplate = require('./apl_template_export.json');

//multilanguage https://developer.amazon.com/blogs/alexa/post/bbc5ea2e-d7ae-43f9-8f02-7b3583e8de96/5-tips-for-building-multi-language-alexa-skills
//audio https://developer.amazon.com/es/docs/custom-skills/speech-synthesis-markup-language-ssml-reference.html#audio

const Alexa = require('ask-sdk-core');


function fillDataSource(i18n, datasources, chosenCategory) {
  
  let category = i18n.getResource({ key: "todo" });
  if (chosenCategory) {
    category = i18n.getResource({ key: chosenCategory });
  }

  datasources.listTemplate2Metadata.title = i18n.getResource({ key: "InvocationName" });
  datasources.listTemplate2ListData.hintText = i18n.getResource({ key: "hintTry" }) + category + "\"";

  for(let i = 0; i < datasources.listTemplate2ListData.listPage.listItems.length; i++) {
    let listItemCategory = datasources.listTemplate2ListData.listPage.listItems[i].token;
    datasources.listTemplate2ListData.listPage.listItems[i].textContent.primaryText.text = i18n.getResource({ key: listItemCategory });;
    datasources.listTemplate2ListData.listPage.listItems[i].textContent.secondaryText.text = i18n.getResource({ key: listItemCategory });;
  }
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'LaunchRequest';
  },
  handle(handlerInput) {

    let i18n = new I18N({ request: handlerInput.requestEnvelope.request });

    const speechText = i18n.getResource({ key: "LaunchRequest" });
    const invocationName = i18n.getResource({ key: "InvocationName" });

    let res = handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(invocationName, speechText);



    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
        fillDataSource(i18n, aplTemplate.datasources);
        res.addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: aplTemplate.document,
          datasources: aplTemplate.datasources
        }); 
    }
    
    return res.getResponse();
  },
};


const TouchHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'Alexa.Presentation.APL.UserEvent';
  },
  handle(handlerInput) {
    const i18n = new I18N({ request: handlerInput.requestEnvelope.request });

    const category = handlerInput.requestEnvelope.request.arguments[3];
    const responseSoundData = getResponseSoundData(i18n, category);

    fillDataSource(i18n, aplTemplate.datasources, category);

    return handlerInput.responseBuilder
      .speak(responseSoundData.speechText)
      .reprompt(responseSoundData.reprompt)
      .withSimpleCard(responseSoundData.invocationName, responseSoundData.card)
      .addDirective({
        type: 'Alexa.Presentation.APL.RenderDocument',
        version: '1.0',
        document: aplTemplate.document,
        datasources: aplTemplate.datasources
      })
      .getResponse();
  },
};

function getResponseSoundData(i18n, category, value) {
  let sm = new SoundsManager();

  let soundURL = sm.getRandomSoundURL({ category });
  const invocationName = i18n.getResource({ key: "InvocationName" });
  const ask = i18n.getResource({ key: "AskSound" });
  const reprompt = i18n.getResource({ key: "Reprompt" });
  
  let card = i18n.getResource({ key: "Playing" });
  if (value) {
      card = card + value;
  } else {
      card = card + i18n.getResource({ key: "todo" });
  }

  function getRandomInt(min, max) {
    min = Math.ceil(min);
    max = Math.floor(max);
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

  let minireprompts = i18n.getResource({ key: "Minireprompt" });
  let random = getRandomInt(0, minireprompts.length - 1);
  let minireprompt = minireprompts[random];

  let speechText = `<audio src="${soundURL}" /> <break time="2s"/> ${minireprompt}`;
  if (!category) speechText = ask + speechText;

  return {
    speechText,
    reprompt,
    invocationName,
    card
  }
}

const PlaySoundIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'PlaySoundIntent';
  },
  handle(handlerInput) {
      
    const request = handlerInput.requestEnvelope.request;

    let i18n = new I18N({ request });
    
    //get sound
    let category = null;
    let value = null;
    try {
      if (request.intent
        && request.intent.slots
        && request.intent.slots.category 
        && request.intent.slots.category.resolutions) {
          category = handlerInput.requestEnvelope.request.intent.slots.category.resolutions.resolutionsPerAuthority[0].values[0].value.id;
          value = handlerInput.requestEnvelope.request.intent.slots.category.value;
        }
    } catch (err) {
      console.log(`Error retrieving category from intent ${err}`);
    }

    
    const responseSoundData = getResponseSoundData(i18n, category, value);

    let res = handlerInput.responseBuilder
      .speak(responseSoundData.speechText)
      .reprompt(responseSoundData.reprompt)
      .withSimpleCard(responseSoundData.invocationName, responseSoundData.card)

      //console.log("suported APL? " + JSON.stringify(handlerInput.requestEnvelope.context));

    if (handlerInput.requestEnvelope.context.System.device.supportedInterfaces['Alexa.Presentation.APL']) {
        fillDataSource(i18n, aplTemplate.datasources);
        res.addDirective({
          type: 'Alexa.Presentation.APL.RenderDocument',
          version: '1.0',
          document: aplTemplate.document,
          datasources: aplTemplate.datasources
        }); 
    }
    
    return res.getResponse();
  },
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && handlerInput.requestEnvelope.request.intent.name === 'AMAZON.HelpIntent';
  },
  handle(handlerInput) {
    let i18n = new I18N({ request: handlerInput.requestEnvelope.request });

    const speechText = i18n.getResource({ key: "AMAZON.HelpIntent" });
    const invocationName = i18n.getResource({ key: "InvocationName" });

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .withSimpleCard(invocationName, speechText)
      .getResponse();
  },
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'IntentRequest'
      && (handlerInput.requestEnvelope.request.intent.name === 'AMAZON.CancelIntent'
        || handlerInput.requestEnvelope.request.intent.name === 'AMAZON.StopIntent');
  },
  handle(handlerInput) {
    let i18n = new I18N({ request: handlerInput.requestEnvelope.request });

    const speechText = i18n.getResource({ key: "AMAZON.StopIntent" });
    const invocationName = i18n.getResource({ key: "InvocationName" });

    return handlerInput.responseBuilder
      .speak(speechText)
      .withSimpleCard(invocationName, speechText)
      .getResponse();
  },
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return handlerInput.requestEnvelope.request.type === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    console.log(`Session ended with reason: ${handlerInput.requestEnvelope.request.reason}`);

    return handlerInput.responseBuilder.getResponse();
  },
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput, error) {
    console.log(`Fallback handled: ${error.message}`);

    let i18n = new I18N({ request: handlerInput.requestEnvelope.request });

    const speechText = i18n.getResource({ key: "Fallback" });
    const invocationName = i18n.getResource({ key: "InvocationName" });

    return handlerInput.responseBuilder
      .speak(speechText)
      .reprompt(speechText)
      .getResponse();
  },
};

const skillBuilder = Alexa.SkillBuilders.custom();

exports.handler = skillBuilder
  .addRequestHandlers(
    TouchHandler,
    LaunchRequestHandler,
    PlaySoundIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .lambda();
