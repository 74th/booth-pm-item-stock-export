interface Product {
    name: string;
    stock: string;
}

function extractData(): Product[] {
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

chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === 'extractData') {
        const data = extractData();
        sendResponse({ data });
    }
});
