document.addEventListener('DOMContentLoaded', () => {
    const predictBtn = document.getElementById('predict-btn');
    const result = document.getElementById('result');
    const priceElement = document.getElementById('price');
    const screenSizeInput = document.getElementById('screen_size');
    const screenSizeValue = document.getElementById('screen_size_value');

    screenSizeInput.addEventListener('input', (e) => {
        screenSizeValue.textContent = `${e.target.value}"`;
    });

    predictBtn.addEventListener('click', async () => {
        const data = {
            company: document.getElementById('company').value,
            type: document.getElementById('type').value,
            ram: parseInt(document.getElementById('ram').value),
            weight: parseFloat(document.getElementById('weight').value),
            touchscreen: document.getElementById('touchscreen').value,
            ips: document.getElementById('ips').value,
            screen_size: parseFloat(document.getElementById('screen_size').value),
            resolution: document.getElementById('resolution').value,
            cpu: document.getElementById('cpu').value,
            hdd: parseInt(document.getElementById('hdd').value),
            ssd: parseInt(document.getElementById('ssd').value),
            gpu: document.getElementById('gpu').value,
            os: document.getElementById('os').value
        };
        const [x_res, y_res] = data.resolution.split('x').map(Number);
        data.ppi = Math.sqrt(x_res**2 + y_res**2) / data.screen_size;
        try {
            const response = await fetch('/predict', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(data),
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const prediction = await response.json();
            result.classList.remove('hidden');
            priceElement.textContent = `₹${prediction.price.toLocaleString()}`;

            // Add animation
            priceElement.style.animation = 'none';
            priceElement.offsetHeight;
            priceElement.style.animation = 'fadeIn 0.5s';
        } catch (error) {
            console.error('Error:', error);
            result.classList.remove('hidden');
            priceElement.textContent = 'An error occurred. Please try again.';
        }
    });
});
