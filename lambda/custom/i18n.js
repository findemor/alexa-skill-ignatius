const locale = Symbol();
const resources = Symbol();

//comentamos los idiomas no soportados
const globalResourceKey = {
  //'de-DE': 'en',
  'en-AU': 'es',
  'en-GB': 'es',
  'en-IN': 'es',
  'en-US': 'es',
  'es-ES': 'es',
  'es-MX': 'es',
  //'fr-CA': 'fr',
  //'fr-FR': 'fr',
  //'it-IT': 'it',
  //'ja-JP': 'ja',
};

class I18n {
  constructor({ request }) {
      
    this[locale] = 'es-ES';
    if (request !== undefined && request.locale !== undefined) {
      this[locale] = request.locale;
    }

    this[resources] = this.buildResources();
  }

  getResource({ key }) {
    let l = this[locale];
    let lkey = globalResourceKey[l];
    let data = null;
    
    try {
      data = this[resources][key][lkey];
    } catch(err) {
      console.log(`Not found resource for locale "${l}" key "${key}" lkey "${lkey}"`);
      data = null;
    }

    return data;
  }

  buildResources() {
    return {
      "InvocationName": {
        "es": "La boca de Ignatius",
      },
      "AskSound": {
        "es": "",
      },
      "Reprompt": {
        "es": "Pídeme que reproduzca otra frase.",
      },
      "Minireprompt": {
        "es": [ "pide otra", "elige otra", "pídeme otra"]
      },
      "Playing": {
        "es": "Reproduciendo: ",
      },
      "Random": {
        "es": "Aleatorio.",
      },
      "LaunchRequest": {
        "es": "¿Qué quieres escuchar?",
      },
      "AMAZON.HelpIntent": {
        "es": "Dime que reproduzca una frase aleatoria, o dime que reproduzca frases tipicas, por ejemplo: di que calvario, frases de elvis canario o haz el grito sordo",
      },
      "AMAZON.StopIntent": {
        "es": "Adiós!",
      },
      "Fallback": {
        "es": "Lo siento, no te he entendido. Pideme un sonido diciendo: Reproduce un sonido aleatorio. Pídeme ayuda para conocer más comandos.",
      },
      "hintTry": {
        "es": "Prueba diciendo: \"Reproduce una frase ",
      },
      "todo": {
        "es": "cualquiera",
      },
    }
  }
}

module.exports = I18n;