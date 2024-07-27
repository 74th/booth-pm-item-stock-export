"use strict";
var _a, _b;
function extractDataFromPage() {
    var _a, _b, _c, _d, _e, _f, _g, _h;
    const itemTags = document.querySelectorAll('.item-name-with-stock');
    const data = [];
    for (const itemTag of itemTags) {
        const name = ((_b = (_a = itemTag.querySelector(".item-label a")) === null || _a === void 0 ? void 0 : _a.lastChild) === null || _b === void 0 ? void 0 : _b.textContent) || "";
        const variationTags = itemTag.querySelectorAll(".dashboard-items-variation .row");
        for (const variationTag of variationTags) {
            const variation = ((_d = (_c = variationTag.querySelector(".dashboard-items-variation-label")) === null || _c === void 0 ? void 0 : _c.lastChild) === null || _d === void 0 ? void 0 : _d.textContent) || "";
            const sold = ((_f = (_e = variationTag.querySelector(".sales_quantity .count")) === null || _e === void 0 ? void 0 : _e.lastChild) === null || _f === void 0 ? void 0 : _f.textContent) || "";
            const stock = ((_h = (_g = variationTag.querySelector(".stock")) === null || _g === void 0 ? void 0 : _g.lastChild) === null || _h === void 0 ? void 0 : _h.textContent) || "";
            data.push({
                name: name,
                variation: variation,
                sold: sold,
                stock: stock,
            });
        }
    }
    return data;
}
function csvEncode(org) {
    return "\"" + org.trim().replace("\"", "\\\"") + "\"";
}
function buildCSV(data) {
    return 'name,variation,sold,stock\n'
        + data.map(e => [csvEncode(e.name), csvEncode(e.variation), e.stock, e.sold].join(",")).join('\n');
}
(_a = document.getElementById('download-btn')) === null || _a === void 0 ? void 0 : _a.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        var _a;
        if ((_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: extractDataFromPage
            }, (results) => {
                if (results && results[0].result) {
                    const data = results[0].result;
                    downloadCSV(data);
                }
            });
        }
    });
});
function downloadCSV(data) {
    const csvContent = 'data:text/csv;charset=utf-8,'
        + buildCSV(data);
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'booth_stock.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
(_b = document.getElementById('clipboard-btn')) === null || _b === void 0 ? void 0 : _b.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        var _a;
        if ((_a = tabs[0]) === null || _a === void 0 ? void 0 : _a.id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: extractDataFromPage
            }, (results) => {
                if (results && results[0].result) {
                    const data = results[0].result;
                    clipboardCSV(data);
                }
            });
        }
    });
});
function clipboardCSV(data) {
    const csvContent = buildCSV(data);
    try {
        navigator.clipboard.writeText(csvContent);
    }
    catch (err) {
        console.error('Failed to copy: ', err);
    }
}
