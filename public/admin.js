const API_BASE_URL = window.location.port === '5500' ? 'http://localhost:3000' : '';

document.addEventListener('DOMContentLoaded', () => {
    const bookingsTableBody = document.getElementById('bookingsTableBody');
    const refreshBtn = document.getElementById('refreshBtn');
    const totalCount = document.getElementById('totalBookings');

    if (bookingsTableBody) {
        fetchBookings();
    }

    if (refreshBtn) {
        refreshBtn.addEventListener('click', () => {
            bookingsTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">Refreshing...</td></tr>';
            fetchBookings();
        });
    }

    async function fetchBookings() {
        try {
            const response = await fetch(`${API_BASE_URL}/api/admin/bookings`);
            const result = await response.json();
            
            if (result.success) {
                if (totalCount) totalCount.textContent = result.bookings.length;
                renderTable(result.bookings);
            } else {
                console.error('API returned success:false', result);
                bookingsTableBody.innerHTML = `<tr><td colspan="4" style="text-align:center;color:red;">API Error: ${result.message || 'Unknown error'}</td></tr>`;
            }
        } catch (error) {
            console.error('Fetch error:', error);
            bookingsTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;color:red;">Failed to reach server. Make sure you are using http://localhost:3000</td></tr>';
        }
    }

    function renderTable(bookings) {
        if (bookings.length === 0) {
            bookingsTableBody.innerHTML = '<tr><td colspan="4" style="text-align:center;">No bookings found yet.</td></tr>';
            return;
        }

        bookingsTableBody.innerHTML = bookings.map(booking => `
            <tr>
                <td>${booking.name}</td>
                <td>${booking.company}</td>
                <td>${booking.phone}</td>
                <td>${new Date(booking.createdAt).toLocaleDateString()}</td>
            </tr>
        `).join('');
    }
});
