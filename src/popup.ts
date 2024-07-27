interface Product {
    name: string;
    stock: string;
}

document.getElementById('extract-btn')?.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: extractDataFromPage
            }, (results) => {
                if (results && results[0].result) {
                    const data: Product[] = results[0].result;
                    downloadCSV(data);
                }
            });
        }
    });
});

function extractDataFromPage(): Product[] {
    const products = document.querySelectorAll('.product');
    const data: Product[] = [];

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

function downloadCSV(data: Product[]): void {
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
