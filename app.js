const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const plotly = require('plotly')('yassinezaddem', 'arbRCWQKJeoZykUNlGm2'); // Replace with your Plotly credentials
const df = require('dataframe-js').default;

const app = express();
const port = 3000;


const workbook = xlsx.readFile('C:\Users\Yacine\Desktop\Dataframe IM task');
const sheetName = workbook.SheetNames[0];
const data = xlsx.utils.sheet_to_json(workbook.Sheets[sheetName]);

const dfInstance = new df(data);

app.use(bodyParser.urlencoded({ extended: true }));
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

app.get('/', (req, res) => {
    res.render('index', { table: dfInstance.toString() });
});

app.post('/plot', (req, res) => {
    const selectedColumns = req.body.columns;

    const plotData = [{
        x: dfInstance.get(selectedColumns[0]).toArray(),
        y: dfInstance.get(selectedColumns[1]).toArray(),
        mode: 'markers',
        type: 'scatter'
    }];

    const layout = {
        title: 'Scatter Plot',
        xaxis: { title: selectedColumns[0] },
        yaxis: { title: selectedColumns[1] }
    };

    const graphOptions = { layout: layout, filename: 'scatter-plot', fileopt: 'overwrite' };

    plotly.plot(plotData, graphOptions, (err, msg) => {
        if (err) return console.log(err);

        const plotUrl = msg.url + '.embed';
        res.render('plot', { plotUrl: plotUrl });
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
