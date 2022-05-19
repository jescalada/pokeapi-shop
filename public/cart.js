let userId = 1;

async function loadPokemonById(pokemonId) {
    const pokemon = await $.get(`/pokemon/${pokemonId}/`, function (pokemon, status) {

    })
    return pokemon[0]
}

async function loadPokemonToDOM(pokemonId, quantity) {
    let pokemonData = await loadPokemonById(pokemonId)
    
    $("#results").append(content)
    console.log("Total cost: " + parseFloat(pokemonData.price) * quantity)
}

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
        data.cart.forEach(async (pokemon) => {
            await loadPokemonToDOM(pokemon.pokemonId, pokemon.quantity)
        });
    });
}

loadCart();