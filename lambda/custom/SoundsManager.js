const config = require('./config.json');

const s3Container = Symbol();
const soundBankURL = "/{category}/{track}.mp3"
const soundsCategories = {
  allright:1,
  calvario:4,
  canarias:12,
  comedy:1,
  coomo:1,
  coros:6,
  cristina:4,
  ecuador:3,
  elvis:8,
  enfadado:6,
  entretenme:1,
  gritosordo:5,
  hombremayor:1,
  indibiginin:2,
  meme:21,
  mrchaman:14,
  padre:2,
  padrestenerife:4,
  rikidiki:1,
  risa:4,
  sirarchibald:3,
  spontiak:3,
  todo:105,
  whatatime:1,
};

const DEFAULT_CATEGORY = "others";

class SoundsManager {
  constructor() {
    this[s3Container] = process.env.S3_CONTAINER || config.env.S3_CONTAINER;
  }

  getRandomCategory() {
    let count = Object.keys(soundsCategories).length;
    let selected = this.randomIntFromInterval(0, count - 1);
    return Object.keys(soundsCategories)[selected]
  }

  /**
   * Obtiene un mp3 aleatorio dentro de la categoria
   */
  getRandomSoundURL({ category }) 
  {
    let c = category;
    let trackURL = null;
    
    //by default, we choose a character randomly
    if (!c) {
     c = this.getRandomCategory(soundsCategories);
    }

    if (!this[s3Container]) console.log("WARNING: S3_CONTAINER environment variable must be set up");

    let categoryTracks = soundsCategories[c];
    if (categoryTracks) {
      let trackNumber = this.randomIntFromInterval(1, categoryTracks);
      trackURL = (this[s3Container] + soundBankURL).replace("{category}", c).replace("{track}", trackNumber);
    } 

    return trackURL;
  }

  randomIntFromInterval(min,max) // min and max included
  {
      return Math.floor(Math.random()*(max-min+1)+min);
  }

}

module.exports = SoundsManager;