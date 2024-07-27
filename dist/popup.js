"use strict";
var _a;
(_a = document.getElementById('extract-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        var _a;
        if ((_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                function: extractDataFromPage
            }, (results) => {
                if (results && results[0].result) {
                    const data = results[0].result;
                    downloadCSV(data);
                }
            });
        }
    });
});
function extractDataFromPage() {
    const products = document.querySelectorAll('.product');
    const data = [];
    products.forEach(product => {
        const nameElement = product.querySelector('.product-name');
        const stockElement = product.querySelector('.product-stock');
        if (nameElement && stockElement) {
            const name = nameElement.textContent || '';
            const stock = stockElement.textContent || '';
            data.push({ name, stock });
        }
    });
    return data;
}
function downloadCSV(data) {
    const csvContent = 'data:text/csv;charset=utf-8,'
        + data.map(e => `${e.name},${e.stock}`).join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'booth_stock.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
