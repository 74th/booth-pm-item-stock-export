interface Product {
    name: string;
    variation: string;
    stock: string;
    sold: string;
}

function extractDataFromPage(): Product[] {
    const itemTags = document.querySelectorAll('.item-name-with-stock');
    const data: Product[] = [];

    for (const itemTag of itemTags) {
        const name = itemTag.querySelector(".item-label a")?.lastChild?.textContent || "";
        const variationTags = itemTag.querySelectorAll(".dashboard-items-variation .row");

        for (const variationTag of variationTags) {
            const variation = variationTag.querySelector(".dashboard-items-variation-label")?.lastChild?.textContent || "";
            const sold = variationTag.querySelector(".sales_quantity .count")?.lastChild?.textContent || "";
            const stock = variationTag.querySelector(".stock")?.lastChild?.textContent || "";

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

function csvEncode(org: string): string {
    return "\"" + org.trim().replace("\"", "\\\"") + "\"";
}

function buildCSV(data: Product[]): string {
    return 'name,variation,sold,stock\n'
        + data.map(e => [csvEncode(e.name), csvEncode(e.variation), e.stock, e.sold].join(",")).join('\n');
}

document.getElementById('download-btn')?.addEventListener('click', () => {
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

function downloadCSV(data: Product[]): void {
    const csvContent = 'data:text/csv;charset=utf-8,'
        + buildCSV(data)

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', 'booth_stock.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}

document.getElementById('clipboard-btn')?.addEventListener('click', () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
            chrome.scripting.executeScript({
                target: { tabId: tabs[0].id },
                func: extractDataFromPage
            }, (results) => {
                if (results && results[0].result) {
                    const data: Product[] = results[0].result;
                    clipboardCSV(data);
                }
            });
        }
    });
});

function clipboardCSV(data: Product[]): void {
    const csvContent = buildCSV(data)
    try {
        navigator.clipboard.writeText(csvContent);
    } catch (err) {
        console.error('Failed to copy: ', err);
    }
}