var userId = 1;

function loadProfile() {
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
            $("#username").text(data.username);
            data.past_orders.forEach(order => {
                let element = `<h2>${order[0].order_id}</h2><h3>${order[0].timestamp}</h3>
                `
                order[0].cart.forEach(pokemon => {
                    element += `<p>${pokemon.pokemonId} ${pokemon.quantity}</p>`;
                        // // await loadPokemonToDOM(pokemon.pokemonId, pokemon.quantity)
                        // $("#subtotal").text(subtotal.toFixed(2))
                        // $("#tax").text((subtotal * taxRate).toFixed(2))
                        // $("#total").text((subtotal * taxRate + subtotal).toFixed(2))
                    
                })
                $("#past-orders").html(element);
            });
        });
}

loadProfile();