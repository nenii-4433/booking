const fetch = require('node-fetch');

async function testBooking() {
    try {
        const response = await fetch('http://localhost:3000/api/bookings', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name: 'Test User',
                company: 'Test Co',
                phone: '1234567890'
            })
        });
        const data = await response.json();
        console.log('Response status:', response.status);
        console.log('Response body:', data);
    } catch (error) {
        console.error('Error fetching:', error);
    }
}

testBooking();
