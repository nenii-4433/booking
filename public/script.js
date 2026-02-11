document.addEventListener('DOMContentLoaded', () => {
    const form = document.getElementById('bookingForm');
    const successMessage = document.getElementById('successMessage');
    const bookAgainBtn = document.getElementById('bookAgain');

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        const formData = {
            name: form.name.value,
            company: form.company.value,
            phone: form.phone.value
        };

        try {
            const response = await fetch('/api/bookings', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(formData)
            });

            const result = await response.json();

            if (result.success) {
                // Show success message
                form.classList.add('hidden');
                successMessage.classList.remove('hidden');
            } else {
                alert('Booking failed. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            alert('An error occurred. Please try again later.');
        }
    });

    bookAgainBtn.addEventListener('click', () => {
        form.reset();
        successMessage.classList.add('hidden');
        form.classList.remove('hidden');
    });
});
