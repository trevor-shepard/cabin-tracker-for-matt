const cheerio = require('cheerio')


const get = (url, callback) => {
    const getRequest = new XMLHttpRequest();
  
    getRequest.open("get", url, true);
  
    getRequest.addEventListener("readystatechange", function() {
      if (getRequest.readyState === 4 && getRequest.status === 200) {
        callback(getRequest.responseText);
      }
    });
  
    getRequest.send();
}

document.addEventListener("DOMContentLoaded", () => {

    console.log("hi")

    get("https://api.allorigins.ml/get?method=raw&url=https://ca.usharbors.com/monthly-tides/California-North%20Coast/Bolinas/2019-02", (response) => {
        const contents = JSON.parse(response).contents
        const $ = cheerio.load(contents)
        const body = $('tbody')
        debugger

    })

    
});