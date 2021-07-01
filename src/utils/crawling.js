const axios = require("axios");
const cheerio = require("cheerio");



const getHtml = async(stockCode) => {
  axios.defaults.headers.post['Access-Control-Allow-Origin'] = "*"
  axios.defaults.baseURL = 'http://localhost:3000';
  axios.defaults.headers.post['Content-Type'] ='application/x-www-form-urlencoded';
    try {
        console.log('getHtml starts!');
        const headers = {withCredentials: false};
        const config = {
          headers:{"Access-Control-Allow-Origin":"*",
          "Access-Control-Allow-Credentials": true}
        }
        // axios.defaults.baseURL = 'http://localhost:8001';
        // axios.defaults.headers.get['Content-Type'] = 'application/json;charset=utf-8';
        // axios.defaults.headers.get['Access-Control-Allow-Origin'] = '*';
        return axios.get("https://finance.naver.com/item/main.nhn?code=" + stockCode, config);
        // console.log(html)
    } catch (error) {
        console.log(error);
    }
}

const stockCodeArr = ['016610', '005930', '035420', '105560', '046310', '078890', '001520', '049630', '048550', '119860']


const getPrice = (arr) => {
  arr.map(x => getHtml(x)
  .then(html => {
    console.log('getHtml passed')
    const $ = cheerio.load(html.data.toString('binary'), {decodeEntities:true});
  
    const price = $('dl[class=blind]').html()
    const index = price.indexOf('<dd>')
    const index1 = price.indexOf('<dd>', index+2)
    const index2 = price.indexOf('<dd>', index1+2)
    const index3 = price.indexOf('<dd>', index2+2)

    let indexCount = 0;
    let priceString = ""
    while (price[index3 + 11 + indexCount] !== " ") {
        // console.log(price[index3 + 11 + indexCount])
        priceString = priceString + price[index3 + 11 + indexCount]
        indexCount++;
        // console.log(indexCount, priceString)
    }

    console.log(x, priceString)

  }))
}


const getSinglePrice = async(stockCode) => {
  getHtml(stockCode)
  .then(html => {
    console.log('getHtml passed')
    const $ = cheerio.load(html.data.toString('binary'), {decodeEntities:true});
  
    const price = $('dl[class=blind]').html()
    const index = price.indexOf('<dd>')
    const index1 = price.indexOf('<dd>', index+2)
    const index2 = price.indexOf('<dd>', index1+2)
    const index3 = price.indexOf('<dd>', index2+2)

    let indexCount = 0;
    let priceString = ""
    while (price[index3 + 11 + indexCount] !== " ") {
        // console.log(price[index3 + 11 + indexCount])
        priceString = priceString + price[index3 + 11 + indexCount]
        indexCount++;
        // console.log(indexCount, priceString)
    }

    console.log(stockCode, priceString);

    // return priceString
  })
}

// export default getSinglePrice

// getSinglePrice('005930')
getPrice(stockCodeArr)


// const getFinal = (stockCode) => {
//   getSinglePrice(stockCode).then(price => {
//     console.log(price)
//     return price
//   })
// }
  
// const price = getFinal('005930')
// console.log(price)
// setInterval(() => getPrice(stockCodeArr), 1000)