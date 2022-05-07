//importing the required dependencies
const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');

const app = express();
const PORT = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

//import csv file
var csv = fs.readFileSync('./AAPL.csv', {encoding: 'utf-8'});

//function to convert csv to an array of json objects
const toJSON = (csvData) =>{
    var rows = csvData.split('\n');
    const headers = rows[0].split(',');
    var jsonArray = [];
    rows.slice(1).map(r =>{
        var object = {};
        const row = r.split(',');
        headers.map((i, j) => object[i] = row[j]);
        jsonArray.push(object);
    });
    
    return jsonArray;  
}

const json = toJSON(csv);

//get request handler
app.get('/api/:date', (req, res) => {
  const date = req.params.date;
  var result = json.filter(stock => {
    return stock.Date === date;
  })
  if (result.length !== 0){
  res.send(result[0]);
  }
  else{
    res.send(`No data found for the requested date, ${date}`);
  }
})

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});