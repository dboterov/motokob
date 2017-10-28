var fs = require('fs');
var pdf = require('html-pdf');

function createQuotation(req, res) {
    console.log('creando cotizacion ' + req.body.id);

    if (!req.body.quotationLines || req.body.quotationLines.length == 0) {
        res.status(400).send({ message: 'No se recibieron productos dentro de la cotización' });
    } else {
        //Process quotation lines and convert them into html code
        var quotationLines = req.body.quotationLines;
        var strQuotationLines = '';
        for (var i = 0; i < quotationLines.length; i++) {
            strQuotationLines += '<tr><td class="align-left">';
            strQuotationLines += quotationLines[i].itemName;
            strQuotationLines += '</td><td class="align-right">';
            strQuotationLines += quotationLines[i].price;
            strQuotationLines += '</td><td class="align-right">';
            strQuotationLines += '</td><td class="align-right">';
            strQuotationLines += '</td><td class="align-center">';
            strQuotationLines += '</td><td class="align-right">';
            strQuotationLines += '</td></tr>';
        }
        console.log('quotlines: ' + strQuotationLines);

        var html = fs.readFileSync('./templates/quotation.html', 'utf8');
        html = html.replace('{docNumber}', req.body.id);
        html = html.replace('{customerName}', req.body.customerName);
        html = html.replace('{customerPhone}', req.body.customerPhone);
        html = html.replace('{salesmanName}', req.body.salesmanName);
        html = html.replace('{salesmanPhone}', req.body.salesmanPhone);
        html = html.replace('{documentDate}', req.body.documentDate);
        html = html.replace('{quotationLines}', strQuotationLines);

        var options = { height: '5.5in', width: '8.5in' };
        var fileName = 'quotation' + new Date().getTime() + '.pdf';

        pdf.create(html, options).toFile('./documents/' + fileName, function (err, response) {
            if (err) {
                console.error(err);
                res.status(500).send({ err });
            } else {
                console.log(response);
                res.status(200).send({ quotation: response });
            }
        });
    }
}

module.exports = {
    createQuotation
}
