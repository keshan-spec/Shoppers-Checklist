export const fetchBarCode = async (barCode: string) => {
    const URL = `https://www.bestwaywholesale.co.uk/search?w=${barCode}`;
    const response = await fetch(URL);
    const htmlString = await response.text();

    return htmlString;
}

export const fetchQuery = async (query: string) => {
    const URL = `https://www.dhamecha.com/search-results`;
    const response = await fetch(URL,{
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `lstSearchCat=&txtTopSearch=${query}`
        });
    const htmlString = await response.text();

    return htmlString;
}
