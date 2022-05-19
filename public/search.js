async function loadPokemonById(pokemonId) {
    try {
        const pokemon = await $.get(`/pokemon/${pokemonId}/`, function (pokemon, status) {});
        return pokemon[0];
    } catch {
        let result = `
            <p>Pokemon #${pokemonId} does not exist!</p>
        `
        $("#results").html(result);
    }
}

async function loadPokemonByName(pokemonName) {
    try {
        const pokemon = await $.get(`/name/${pokemonName}/`, function (pokemon, status, xhr) {});
        return pokemon[0];
    } catch {
        let result = `
            <p>${pokemonName} does not exist!</p>
        `
        $("#results").html(result);
    }
}

async function loadPokemonListByType(type) {
    try {
        return await $.get(`/type/${type}/`, function (pokemon, status) {});
    } catch {
        let result = `
            <p>Did not find any pokemon of type ${type}.</p>
        `
        $("#results").html(result);
    }
}

async function loadPokemonListByAbility(ability) {
    try {
        return await $.get(`/ability/${ability}/`, function (pokemon, status) {});
    } catch {
        let result = `
            <p>Did not find any pokemon with the ability ${ability}.</p>
        `
        $("#results").html(result);
    }
}

async function loadTimeline() {
    try {
        const timeline = await $.get(`/timeline/`, function (timeline, status) {});
        return timeline;
    } catch {
        return null;
    }
}

// Gets the basic data needed to display a pokemon to the client.
async function getPokemonBasicData(name) {
    let pokemon = await loadPokemonByName(name);
    let result = {
        id: pokemon['id'],
        name: pokemon['name'],
        sprite: pokemon.sprite
    };
    return result;
}

// Gets the basic data needed to display a pokemon to the client.
async function getPokemonBasicDataById(id) {
    let pokemon = await loadPokemonById(id);
    let result = {
        id: pokemon['id'],
        name: pokemon['name'],
        sprite: pokemon.sprite
    };
    return result;
}

// Searches a pokemon by name and appends it to the DOM if it exists
async function searchByName(name=$("#search-box").val()) {
    await getPokemonBasicData(name).then((pokemon) => {
        let grid = `
            <div id="grid">
            `;
        for (row = 0; row < 1; row++) {
            grid += `<div class="row">`;
            for (col = 0; col < 1; col++) {
                index = 0;
                grid += `
            <div class="img-container" onclick="location.href='pokemon.html?id=${pokemon.id}'">
                <img src="${pokemon.sprite}" alt="${pokemon.name}" style="width:100%">
            </div> 
            `;
            }
            grid += `</div>`;
        }
        grid += `</div>`;
        $("#results").html(grid);
    });

    loadTimelineHandler();
}

async function searchByAbility(ability=$("#search-box").val()) {
    let resultList = await loadPokemonListByAbility(ability);
    let numberOfResults = resultList.length;
    let rows = Math.ceil(numberOfResults / 3);
    let grid = `
        <div id="grid">
        `;
    let index = 0;
    for (row = 0; row < rows; row++) {
        grid += `<div class="row">`;
        for (col = 0; col < 3; col++) {
            if (index >= numberOfResults) {
                break;
            }
            pokemonJSON = resultList[index++];
            await getPokemonBasicDataById(pokemonJSON.id).then((pokemon) => {
                grid += `
                <div class="img-container" onclick="location.href='pokemon.html?id=${pokemon.id}'">
                    <img src="${pokemon.sprite}" alt="${pokemon.name}" style="width:100%">
                </div>
                `;
            })
        }
        grid += `</div>`;
    }
    grid += `</div>`;
    $("#results").html(grid);
    
    loadTimelineHandler();
}

async function searchByType(type=$("#search-box").val()) {
    let resultList = await loadPokemonListByType(type);
    let numberOfResults = resultList.length;
    let rows = Math.ceil(numberOfResults / 3);
    let grid = `
        <div id="grid">
        `;
    let index = 0;
    for (row = 0; row < rows; row++) {
        grid += `<div class="row">`;
        for (col = 0; col < 3; col++) {
            if (index >= numberOfResults) {
                break;
            }
            pokemonJSON = resultList[index++];
            await getPokemonBasicDataById(pokemonJSON.id).then((pokemon) => {
                grid += `
                <div class="img-container" onclick="location.href='pokemon.html?id=${pokemon.id}'">
                    <img src="${pokemon.sprite}" alt="${pokemon.name}" style="width:100%">
                </div>
                `;
            })
        }
        grid += `</div>`;
    }
    grid += `</div>`;
    $("#results").html(grid);
    
    loadTimelineHandler();
}

async function loadTimelineHandler() {
    await loadTimeline().then((timeline) => {
        $("#timeline ul").empty();
        let text = ""
        timeline.forEach(entry => {
            let timeData = entry.timestamp.split("T")
            text += `<li onclick="parseQuery('${entry.query}')">Query: ${entry.query}<br>${timeData[0]} ${timeData[1].substring(0,8)}</li>`
        });
        $("#timeline ul").append(text);
    })
}

async function parseQuery(query) {
    let routes = query.split("/")
    if (routes[1] === "name") {
        await searchByName(routes[2])
    } else if (routes[1] === "type") {
        await searchByType(routes[2])
    } else if (routes[1] === "ability") {
        await searchByAbility(routes[2])
    } else {
        console.log("Error parsing the query routes!")
    }
}

loadTimelineHandler();