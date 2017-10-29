var fs = require('fs');
var pdf = require('html-pdf');

function createQuotation(req, res) {
    console.log('creando PDF para cotizacion: ', req.body);
    if (!req.body.items || req.body.items.length == 0) {
        res.status(400).send({ message: 'No se recibieron productos dentro de la cotización' });
    } else {
        try {
            //Process quotation lines and convert them into html code
            var quotationLines = req.body.items;
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
            html = html.replace('{docNumber}', req.body.quotationNumber);
            html = html.replace('{customerName}', req.body.customer.name + ' ' + req.body.customer.surname);
            html = html.replace('{customerPhone}', req.body.customerPhone);
            html = html.replace('{salesmanName}', req.body.salesmanName);
            html = html.replace('{salesmanPhone}', req.body.salesmanPhone);
            html = html.replace('{documentDate}', req.body.date.substring(0, 9));
            html = html.replace('{quotationLines}', strQuotationLines);

            var options = { height: '5.5in', width: '8.5in' };
            var fileName = 'quotation' + new Date().getTime() + '.pdf';

            pdf.create(html, options).toFile('./documents/' + fileName, function (err, response) {
                if (err) {
                    console.error(err);
                    res.status(500).send({ err });
                } else {
                    console.log(response);
                    var stat = fs.statSync(response.filename);
                    res.writeHead(200, {
                        'Content-Type': 'application/pdf',
                        'Content-Length': stat.size,
                        'Content-Disposition': 'inline; filename=cotizacion_"' + req.body.quotationNumber + '".pdf'
                    });
                    var readStream = fs.createReadStream(response.filename);
                    readStream.pipe(res);
                }
            });
        } catch (error) {
            console.error(error);
            res.status(500).send({ error });
        }
    }
}

module.exports = {
    createQuotation
}
