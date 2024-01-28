const router = require("express").Router();
const axios = require("axios")
const cheerio = require("cheerio")
const json2csv = require('json2csv');
const CsvParser = require("json2csv").Parser;

  const options = [
    {
      url:"https://www.erstemarket.hu/befektetesi_alapok/alap/LU0289214628",
      query: "span.i_5382_last_price",
      name: "JPM EUROPE EQUITY PLUS FUND D (ACC) - EUR"
    },
    {
      url:"https://www.erstemarket.hu/befektetesi_alapok/alap/LU0115098948",
      query: "span.i_5512_last_price",
      name: "JPM GLOBAL MACRO OPPORTUNITIES D (ACC) - EUR"
    },
    {
      url:"https://www.erstemarket.hu/befektetesi_alapok/alap/LU1363153740",
      query: "span.i_9262_last_price",
      name: "ALLIANZ US SHORT DURATION HIGH INCOME BOND - AT USD"
    },
    {
      url:"https://www.erstemarket.hu/befektetesi_alapok/alap/LU1883849603",
      query: "span.i_10662_last_price",
      name: "AMUNDI FUNDS PIONEER US BOND A2 USD"
    }
  ]

  let data= []

  for (let i = 0; i < options.length; i++) {
    axios.get(options[i].url)
    .then((response)=>{
      const page = response.data
      const $ = cheerio.load(page)
  
      $(options[i].query, page).each(function () {
        const value = $(this).text()
        if (data.filter(el => el.value == value).length < 1) {
          data.push({name:options[i].name, value:value, url:options[i].url})
        }
      })
    })
    .catch((err)=>console.log(err))
  }

router.get("/", (req, res) => {
 res.render('index.hbs', {data})
});

router.get("/download", (req, res) => {
  const jsonData = data

  const csvFields = ["Name", "Value", "Url"];
  const csvParser = new CsvParser({ csvFields });
  const csvData = csvParser.parse(jsonData);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader("Content-Disposition", "attachment; filename=zoli-market.csv");

  res.status(200).end(csvData);
 });

module.exports = router;