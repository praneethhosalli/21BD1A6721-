const express = require('express');
const axios = require('axios');

const app = express();
const port = 3000;

app.get('/', (request, response) => {
    response.send('Welcome to the Number API!');
});

app.get('/numbers/:numberType', async (request, response) => {
    const { numberType } = request.params;
    let numbers = [];

    try {
        switch (numberType) {
            case 'prime':
                numbers = await fetchNumbersFromServer('primes');
                break;
            case 'fibonacci':
                numbers = await fetchNumbersFromServer('fibo');
                break;
            case 'even':
                numbers = await fetchNumbersFromServer('even');
                break;
            case 'random':
                numbers = await fetchNumbersFromServer('rand');
                break;
            default:
                return response.status(400).json({ error: 'Invalid number type' });
        }

        const responseData = {
            windowPreviousState: [],
            windowCurrentState: numbers,
            numbers: numbers,
            average: calculateAverage(numbers)
        };

        response.json(responseData);
    } catch (error) {
        console.error(error);
        response.status(500).json({ error: 'Internal server error' });
    }
});

async function fetchNumbersFromServer(endpoint) {
    const authToken = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzE3MDc2MTg5LCJpYXQiOjE3MTcwNzU4ODksImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjI4NThhZTMwLTlmMjgtNGMxYS04NzE5LWJlNTlmNTgxYTlmNSIsInN1YiI6InByYW5lZXRoaG9zYWxsaTU5QGdtYWlsLmNvbSJ9LCJjb21wYW55TmFtZSI6IkRtYXJ0IiwiY2xpZW50SUQiOiIyODU4YWUzMC05ZjI4LTRjMWEtODcxOS1iZTU5ZjU4MWE5ZjUiLCJjbGllbnRTZWNyZXQiOiJmU2daR0lQZ0F1UG5jUEhSIiwib3duZXJOYW1lIjoiUHJhbmVldGgiLCJvd25lckVtYWlsIjoicHJhbmVldGhob3NhbGxpNTlAZ21haWwuY29tIiwicm9sbE5vIjoiUHJhbmVldGgifQ.ThgqqwHc-m8xbugSeIXfgufaQ_zAL-JphUzNK8Vt8VM";

    const headers = {
        Authorization: `Bearer ${authToken}`
    };

    try {
        const serverResponse = await axios.get(`http://localhost:3000/test/${endpoint}`, { headers });
        return serverResponse.data.numbers;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

function calculateAverage(numbers) {
    const sum = numbers.reduce((accumulator, currentValue) => accumulator + currentValue, 0);
    return sum / numbers.length;
}

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
