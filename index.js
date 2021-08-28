const fs = require('fs');
const http = require('http');
const url = require('url');

const replaceTemplate = require('./modules/replaceTemplate');

//////////////////////////////////
// FILES

//// Block, sync
// let readTextInInput = fs.readFileSync('./txt/input.txt', 'utf-8');
// console.log(readTextInInput);

// fs.writeFileSync('./txt/input.txt', 'write text in input file block');

//// Non-block, async
// fs.readFile('./txt/start.txt', 'utf-8', (err, data1) => {
//     if (err) return;
//     console.log('data1', data1);
//     fs.readFile(`./txt/${data1}.txt`, 'utf-8', (err, data2) => {
//         console.log(data2);
//         fs.readFile('./txt/append.txt', 'utf-8', (err, data3) => {
//             fs.writeFile('./txt/final.txt', `${data2}\n${data3}`, 'utf-8', err => {
//                 console.log('File updated 😊');
//             });
//         });
//     });
// });


//////////////////////////////////
// SERVER

// const data = {
//     code: '0',
//     message: 'Fetch Successfully',
//     status: 'Success'
// }



const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);

const tempProduct = fs.readFileSync(`${__dirname}/templates/template-product.html`, 'utf-8');
const tempOverview = fs.readFileSync(`${__dirname}/templates/template-overview.html`, 'utf-8');
const tempCard = fs.readFileSync(`${__dirname}/templates/template-card.html`, 'utf-8');


const server = http.createServer((req, res) => {

    // console.log(req.url);
    const { query, pathname } = url.parse(req.url, true);

    console.log(pathname);

    // const pathname = req.url;

    if (pathname === '/') {
        res.end('Hello from the server!');
    } else if (pathname === '/overview') {
        // res.end('This is the OVERVIEW');

        res.writeHead(200, { 'Content-type': 'text/html' });

        const cardsHtml = dataObj.map(el =>  replaceTemplate(tempCard, el));
        const output = tempOverview.replace(/{%PRODUCT_CARDS%}/g, cardsHtml);

        // console.log(cardsHtml);

        res.end(output);  
    } else if (pathname === '/product') {
        // res.end('This is the PRODUCT');

        res.writeHead(200, { 'Content-type': 'text/html' });
        
        const product = dataObj[query.id];
        console.log(product);
        const output = replaceTemplate(tempProduct, product);

        res.end(output);  

    } else if (pathname === '/api') {
        
        // fs.readFile(`${__dirname}/dev-data/data.json`, 'utf-8', (err, data) => {
        //     const productData = JSON.parse(data);
        //     res.writeHead(200, { 'Content-type': 'application/json' });
        //     console.log(productData);
        //     res.end(data);
        // });

            res.writeHead(200, { 'Content-type': 'application/json' });
            res.end(data);


    } else {
        res.writeHead(404, {
            'Content-Type': 'text/html',
            'my-own-header': 'hello-world'
        });
        res.end('<h1>Page not found</h1>');
    }
});

server.listen(3000, '127.0.0.1', () => {
    console.log('Listening to requests on port 8000');
});