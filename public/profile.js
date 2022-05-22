var userId = 1;

// Gets the basic data needed to display a pokemon to the client.
async function getPokemonBasicDataById(id) {
    let pokemon = await loadPokemonById(id);
    let result = {
        id: pokemon.id,
        name: pokemon.name,
        sprite: pokemon.sprite,
        price: pokemon.price
    };
    return result;
}

async function loadPokemonById(pokemonId) {
    try {
        const pokemon = await $.get(`/pokemon/${pokemonId}/`, function (pokemon, status) {});
        return pokemon[0];
    } catch {
        console.log("Pokemon does not exist!")
    }
}

async function loadProfile() {
    let data = {
        userId: userId,
    }

    fetch('/cart', {
        method: 'POST',
        body: JSON.stringify(data),
        headers: {
            'Content-type': 'application/json'
        }
    }).then(response => response.json()).then(async (data) => {
        console.log(data);
            $("#username").text(data.username);
            data.past_orders.forEach(async order => {
                let dateTime = order[0].timestamp.split("T");
                let element = `
                    <div class="order" id="order-${order[0].order_id}">
                        <h2>${dateTime[0]} ${dateTime[1].slice(5)}</h2>
                        <h3>Order id: #${order[0].order_id}</h3>`;
                    element += `</div>`;
                $("#past-orders").append(element);

                order[0].cart.forEach(async (pokemon) => {
                    let pokemonData = await getPokemonBasicDataById(pokemon.pokemonId)
                    console.log(pokemonData);
                    let entry = `
                    <div class="thumbnail-container" style="text-align: center; display: inline-block">
                        <img src="${pokemonData.sprite}" alt="${pokemonData.name}" style="width:100%"
                            onclick="location.href='pokemon.html?id=${pokemonData.id}'" class="pokemon-image-thumb">
                            <div class="row pokemon-buy-details">
                            <h3 class="col card-price">${pokemonData.name}</h3>
                            <h3 class="col card-price">$${pokemonData.price}</h3>
                            <h3 class="col card-quantity" id="card-quantity-${pokemonData.id}">Qty: ${pokemon.quantity}</h3>
                            <h3 class="col card-total-price"> Total: $${(pokemonData.price * pokemon.quantity).toFixed(2)}</h3>
                        </div>
                    </div>
                    
                    `;
                    $(`#order-${order[0].order_id}`).append(entry);
                })
            });
        });
}

loadProfile();