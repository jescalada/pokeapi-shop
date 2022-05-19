let userId = 1;

function loadCart() {
    let data = {
        userId: userId,
    }

    fetch('/cart', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then((data) => {
        console.log(data);
    });
}

loadCart();