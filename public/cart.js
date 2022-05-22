let userId = 1;
var subtotal = 0;
var taxRate = 0.06;

async function loadPokemonById(pokemonId) {
    const pokemon = await $.get(`/pokemon/${pokemonId}/`, function (pokemon, status) {

    })
    return pokemon[0]
}

async function loadPokemonToDOM(pokemonId, quantity) {
    let pokemon = await loadPokemonById(pokemonId)
    let entry = `
        <div class="row">
            <div class="thumbnail-container">
                <img src="${pokemon.sprite}" alt="${pokemon.name}" style="width:100%"
                    onclick="location.href='pokemon.html?id=${pokemon.id}'" class="pokemon-image-thumb">
            </div>
            <div class="row pokemon-buy-details">
                <h3 class="col card-price">${pokemon.name}</h3>
                <h3 class="col card-price">$${pokemon.price}</h3>
                <h3 class="col card-quantity" id="card-quantity-${pokemon.id}">Qty: ${quantity}</h3>
                <h3 class="col card-total-price"> Total: $${(pokemon.price * quantity).toFixed(2)}</h3>
                <button class="col add-to-cart-button" onclick="removeFromCart(${pokemon.id})">Remove</button>
            </div>
        </div>
    `
    $("#cart").append(entry)
    subtotal += parseFloat(pokemon.price) * parseInt(quantity);
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
        subtotal = 0;
        data.cart.forEach(async (pokemon) => {
            await loadPokemonToDOM(pokemon.pokemonId, pokemon.quantity)
            $("#subtotal").text(subtotal.toFixed(2))
            $("#tax").text((subtotal * taxRate).toFixed(2))
            $("#total").text((subtotal * taxRate + subtotal).toFixed(2))
        }) 
    });
    
}

function placeOrder() {
    let total = $("#total").text();
    console.log(total)

    let data = {
        userId: userId,
        total: total
    }
    fetch('/placeorder', {
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