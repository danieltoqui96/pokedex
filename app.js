let data;

init();

// Función principal
async function init() {
  const response = await fetch("pokemon.json");
  data = await response.json();

  displayPokemonList("");
  displayPokemonDetails(data[11].id);

  const $input = document.querySelector("#pokemon-search-input");
  $input.addEventListener("input", function () {
    const filter = $input.value;
    displayPokemonList(filter);
  });
}

// Genera la barra lateral de pokédex
function displayPokemonList(filter) {
  const lowerCaseFilter = filter.toLowerCase();
  const dataFiltered = data.filter((pokemon) =>
    pokemon.name.toLowerCase().includes(lowerCaseFilter)
  );

  let $list = document.querySelector(".list");
  if (!$list) {
    const $sideBar = document.querySelector(".sidebar");
    $sideBar.classList.add("scrollable");

    const $searchSection = document.createElement("section");
    $searchSection.className = "search-container";
    $searchSection.innerHTML = `
    <img src="/img/others/search.svg" alt="imagen de búsqueda" />
    <input id="pokemon-search-input" type="text"/>`;
    $sideBar.append($searchSection);

    $list = document.createElement("ul");
    $list.className = "list scrollable";
    $sideBar.append($list);
  }

  $list.innerHTML = "";
  for (const pokemon of dataFiltered) {
    const name = pokemon.name;
    const number = pokemon.national_number;
    const sprite = pokemon.sprites.normal;
    const $item = document.createElement("li");
    const $button = document.createElement("button");
    $button.innerHTML = `
    <span> #${number} </span> 
    <btn-name>${name}</btn-name>
    <img src="${sprite}" alt="${name}"/>`;
    $button.setAttribute("aria-label", `Ver detalles de ${name}`);
    $button.addEventListener("click", function () {
      displayPokemonDetails(pokemon.id);
    });
    $list.append($item);
    $item.append($button);
  }
}

// Genera menú principal de pokédex
function displayPokemonDetails(id) {
  const pokemon = data.find((p) => p.id === id);
  const $sideMain = document.querySelector(".sidemain");
  $sideMain.textContent = "";
  $sideMain.classList.add("scrollable");

  const $formsTabs = document.createElement("section");
  $formsTabs.className = "forms-btns scrollable";

  for (const form of pokemon.forms) {
    const name = form.name;
    const sprite = form.sprite;
    const $button = document.createElement("button");
    $button.className = form.id === pokemon.id ? "active" : "";
    $button.innerHTML = `<img src="${sprite}" alt="${name}" />`;
    $button.setAttribute("aria-label", `Ver detalles de ${name}`);
    $button.addEventListener("click", function () {
      displayPokemonDetails(form.id);
    });
    $formsTabs.append($button);
  }

  const $header = document.createElement("header"); // header
  $header.className = "main-header";
  $header.innerHTML = `
  <span>N.° ${pokemon.national_number}</span> 
  <h1>${pokemon.name}</h1>`;
  $header.append($formsTabs);

  const $details = document.createElement("article");
  $details.className = "main-details scrollable";
  $details.id = pokemon.id;
  $details.append(
    displaySprite(pokemon),
    displayGeneralInfo(pokemon),
    displayAbilities(pokemon),
    displayTraining(pokemon),
    displayBreeding(pokemon),
    displayStats(pokemon),
    displayDamage(pokemon),
    displayEvolution(pokemon),
    displaySexDifference(pokemon),
    displayForms(pokemon)
  );

  $sideMain.append($header, $details);
}

let isShiny = false;
// Genera sección sprite
function displaySprite({ name, sprites }) {
  const $sprite = document.createElement("section");
  $sprite.className = "sprite";
  $sprite.innerHTML = ` 
  <table>
    <tbody>
      <tr> 
        <td>
          <img 
            id="pokemon-sprite-image" 
            src="${isShiny ? sprites.shiny : sprites.normal}" 
            alt="sprite ${name} normal"/>
        </td> 
      </tr>
      <tr> 
        <td>
          <button id="shiny-button" class="${isShiny ? "active" : ""}">
            <img  src="/img/others/shiny.svg" alt="sprite ${name} shiny" />
          </button>
        </td> 
      </tr>
    </tbody>
  </table>`;

  $sprite.querySelector("#shiny-button").addEventListener("click", function () {
    const button = this;
    const image = document.querySelector("#pokemon-sprite-image");

    if (isShiny) {
      image.src = sprites.normal;
      button.classList.remove("active");
      isShiny = false;
    } else {
      image.src = sprites.shiny;
      button.classList.add("active");
      isShiny = true;
    }
  });

  return $sprite;
}

// Genera sección información general
function displayGeneralInfo({
  generation,
  types,
  category,
  height,
  weight,
  figure,
  color,
  local_numbers,
}) {
  const $figure = `<img src="img/figures/${figure}.png" alt="figura ${figure}"/>`;

  let $types =
    types.length === 1
      ? `&nbsp;${displayType(types[0])}`
      : `&nbsp;${displayType(types[0])}&nbsp;${displayType(types[1])}`;

  let $localNumbers = "";
  local_numbers.forEach(
    (local) =>
      ($localNumbers += ` #${local.number}<span> (${local.name})</span>&nbsp;&nbsp;`)
  );

  const $info = document.createElement("section");
  $info.className = "general-info";
  $info.innerHTML = `
  <h2>Información General</h2>
  <table>
    <tbody>
      <tr> 
        <td><span>Generación:</span> ${generation}</td> 
        <td><span>Clasificación:</span> ${category}</td> 
      </tr>
      <tr> 
        <td><span>Altura:</span> ${height} m</td> 
        <td><span>Figura:</span> ${$figure}</td> 
      </tr>
      <tr> 
        <td><span>Peso:</span> ${weight} kg</td>
        <td><span>Color:</span> ${color}</td> 
      </tr>
      <tr>  
        <td colspan=2><span>Tipos:</span> ${$types}</td>
      </tr>
      <tr>  
        <td colspan=2>${$localNumbers}</td>
      </tr>
    </tbody>
  </table>`;
  return $info;
}

// Genera sección entrenamiento
function displayTraining({
  evs,
  catch_rate,
  base_friendship,
  base_experience,
  max_experience,
  growth_type,
}) {
  const $training = document.createElement("section");
  $training.className = "training";
  $training.innerHTML = `
  <h2>Entrenamiento</h2>
  <table>
    <tbody>
      <tr> <td><span>Puntos Esfuerzo:</span> ${evs}</td> </tr>
      <tr> <td><span>Ratio Captura:</span> ${catch_rate}</td> </tr>
      <tr> <td><span>Amistad base:</span> ${base_friendship}</td> </tr>
      <tr> <td><span>Exp. base:</span> ${base_experience}</td> </tr>
      <tr> <td><span>Exp. Máxima:</span> ${max_experience.toLocaleString(
        "de-DE"
      )} </td> </tr>
      <tr> <td><span>Crecimiento:</span> ${growth_type}</td> </tr>
    </tbody>
  </table>`;
  return $training;
}

// Genera elemento tipo de Pokémon
function displayType(pokemonType) {
  const type = `
  <div class="pokemon-type ${pokemonType}" > 
    <img src="/img/types/${pokemonType}.svg" alt=""tipo ${pokemonType}"" />
    ${pokemonType.toUpperCase()}
  </div>`;
  return type;
}

// Genera sección habilidades
function displayAbilities({ abilities }) {
  const { first, second, hidden } = abilities;
  const $second = second
    ? `<tr><td>${second.name}</td><td>${second.info}</td></tr>`
    : `<tr><td></td><td><span>Sin habilidad secundaria.</span></td></tr>`;
  const $Hidden = hidden
    ? `<tr><td>${hidden.name} <span>(oculta)</span></td><td> ${hidden.info}</td></tr>`
    : `<tr><td></td><td><span>Sin habilidad oculta.</span></td></tr>`;

  const $abilities = document.createElement("section");
  $abilities.className = "abilities";
  $abilities.innerHTML = `
  <h2>Habilidades</h2>
  <table>
    <tbody>
      <tr><td>${first.name}</td><td>${first.info}</td></tr>
      ${$second}
      ${$Hidden}
    </tbody>
  </table>`;
  return $abilities;
}

// Genera sección crianza
function displayBreeding({
  egg_groups,
  male_percentage,
  female_percentaje,
  hatching_cycles,
  hatching_steps,
}) {
  const $male = `<img src="img/others/male.svg" alt="icon macho"/>`;
  const $female = `<img src="img/others/female.svg" alt="icon hembra"/>`;

  const $eggGroups =
    egg_groups.length === 2
      ? `${egg_groups[0]}, ${egg_groups[1]}`
      : `${egg_groups[0]}`;

  const $gender = male_percentage
    ? `${male_percentage}% ${$male} <span> &nbsp; </span> ${female_percentaje}% ${$female}`
    : `Sin genero`;

  const $breeding = document.createElement("section");
  $breeding.className = "breeding";
  $breeding.innerHTML = `
  <h2>Crianza</h2>
  <table>
    <tbody>
      <tr><td><span>Grupo Huevos:</span> ${$eggGroups}</td></tr>
      <tr><td><span>Genero:</span> ${$gender}</td></tr>
      <tr>
        <td><span>Ciclos de Huevo:</span> ${hatching_cycles} <span>(${hatching_steps} pasos)</span></td>
      </tr>
    </tbody>
  </table>`;
  return $breeding;
}

// Genera sección estadísticas
function displayStats({ stats }) {
  const values = Object.values(stats);
  const names = [
    "PS",
    "Ataque",
    "Defensa",
    "At. Esp.",
    "Def. Esp.",
    "Velocidad",
  ];

  let total = 0;
  let $tbody =
    "<tbody> <tr> <td></td> <td colspan=2> Características base</td> <td colspan=2>Nv 100</td></tr>";

  for (let i = 0; i < 6; i++) {
    const width = (values[i] * 100) / 255;
    const min = i === 0 ? 2 * values[i] + 110 : (2 * values[i] + 5) * 0.9;
    const max =
      i === 0
        ? 2 * values[i] + 31 + 252 / 4 + 110
        : (2 * values[i] + 31 + 252 / 4 + 5) * 1.1;

    $tbody += ` 
    <tr>
      <td>${names[i]}</td>
      <td>${values[i]}</td>
      <td class="barchart"> 
        <div 
          class="bar" 
          style="
            width:${width}%; 
            background-color:	hsl(${width * 1.8}deg 100% 50%);
          ">
        </div> 
      </td>
      <td>${Math.floor(min)}</td>
      <td>${Math.floor(max)}</td>
    </tr>`;
    total += values[i];
  }

  $tbody += `
    <tr>
      <td>Total</td>
      <td>${total}</td>
      <td></td>
      <td>Min</td>
      <td>Máx</td>
    </tr> 
  </tbody>`;

  const $stats = document.createElement("section");
  $stats.className = "stats";
  $stats.innerHTML = `
  <h2>Características de combate</h2>
  <table>
    ${$tbody}
  </table>`;
  return $stats;
}

// Genera sección daño recibido
function displayDamage({ damage_received }) {
  const values = Object.values(damage_received);
  const names = [
    "Superdébl",
    "Débill",
    "Normal",
    "Resistente",
    "Superresistente",
    "Inmune",
  ];

  let $tbody = "<tbody>";
  for (let i = 0; i < 6; i++) {
    let $type = "";
    values[i].forEach((type) => {
      $type += `<img src="img/types/${type}.svg" alt="tipo ${type}"/>`;
    });
    $tbody += `<tr><td>${names[i]}</td><td>${$type}</td></tr>`;
  }
  $tbody += "</tbody>";

  const $damage = document.createElement("section");
  $damage.className = "damage-received";
  $damage.innerHTML = `
  <h2>Daño recibido</h2>
  <table>
    <tbody>
    ${$tbody}
    </tbody>
  </table>`;
  return $damage;
}

// Genera sección evolución
function displayEvolution({ evolution }) {
  let $tbody = "<tbody>";
  evolution.forEach((chain) => {
    let $tds = "";
    chain.forEach((pokemon) => {
      const { id, national_number, name, sprite, types, method, rowspan } =
        pokemon;

      let $types =
        types.length === 1
          ? `<img src="img/types/${types[0]}.svg" alt="tipo ${types[0]}"/>`
          : `<img src="img/types/${types[0]}.svg" alt="tipo ${types[0]}"/>
            <img src="img/types/${types[1]}.svg" alt="tipo ${types[1]}"/>`;

      let $methodImg = method
        ? `<img src="${method.img}" alt="Objeto evolutivo">
          <span>${method.info}</span>`
        : `<div></div><div></div>`;

      const td = `
      <td rowspan="${rowspan}">
        <button onclick='displayPokemonDetails("${id}")'>
          <header>
          ${name}
            <span> #${national_number} </span> 
          </header>
          <figure> 
            <img src="${sprite}" alt="sprite ${name}"/>
          </figure>
          <footer>
            ${$methodImg}
            <div> ${$types} </div>
          </footer>
        </button>
      </td>`;
      $tds += td;
    });
    $tbody += `<tr>${$tds} </tr>`;
  });

  $tbody += "</tbody>";

  const $evolution = document.createElement("section");
  $evolution.className = "evolution";
  $evolution.innerHTML = `
  <h2>Cadena Evolutiva</h2>
  <table>
    ${$tbody}
  </table>`;

  return $evolution;
}

// Genera sección formas
function displayForms({ forms }) {
  let $tbody = "<tbody>";
  let count = 0;
  let tr = "<tr>";

  const msg = forms.length === 1 ? "No tiene variaciones de forma." : "";
  forms.forEach((pokemon) => {
    const { id, name, sprite, method, types } = pokemon;
    let $types =
      types.length === 1
        ? `<img src="img/types/${types[0]}.svg" alt="tipo ${types[0]}"/>`
        : `<img src="img/types/${types[0]}.svg" alt="tipo ${types[0]}"/>
            <img src="img/types/${types[1]}.svg" alt="tipo ${types[1]}"/>`;

    let $methodImg = method
      ? `<img src="${method.img}" alt="Objeto evolutivo">
        <span>${method.info}</span>`
      : `<span>${msg}</span>`;

    tr += `
    <td> 
      <button onclick='displayPokemonDetails("${id}")'>
        <header>
          ${name}
          <div> ${$types} </div>
        </header>
        <figure> 
          <img src="${sprite}" alt="sprite ${name}"/>
        </figure>
        <footer>
          ${$methodImg}
        </footer>
      </button>
    </td>`;

    count++;
    if (count === 4) {
      tr += "</tr>";
      $tbody += tr;
      tr = "<tr>";
      count = 0;
    }
  });

  $tbody += tr + "</tbody>";

  const $forms = document.createElement("section");
  $forms.className = "forms";
  $forms.innerHTML = `
  <h2>Variaciones de forma</h2>
  <table>
    ${$tbody}
  </table>`;

  return $forms;
}

// Genera sección diferencia de sexo
function displaySexDifference({ sex_difference }) {
  const { has_gender, male_sprite, female_sprite, info } = sex_difference;

  const $male = `<img src="img/others/male.svg" alt="icon macho"/>`;
  const $female = `<img src="img/others/female.svg" alt="icon hembra"/>`;

  let $spritesMale =
    male_sprite.length === 1
      ? `<img src="${male_sprite[0]}" alt="sprite macho frontal"/>`
      : `<img src="${male_sprite[0]}" alt="sprite macho frontal"/>
        <img src="${male_sprite[1]}" alt="sprite macho posterior"/>`;
  let $spritesFemale =
    female_sprite.length === 1
      ? `<img src="${female_sprite[0]}" alt="sprite hembra frontal"/>`
      : `<img src="${female_sprite[0]}" alt="sprite hembra frontal"/>
        <img src="${female_sprite[1]}" alt="sprite hembra posterior"/>`;

  let $tbody = "<tbody>";
  $tbody += has_gender
    ? `<tr><td>${$male}</td><td>${$female}</td></tr>
      <tr><td>${$spritesMale}</td><td>${$spritesFemale}</td></tr>
      <tr><td colspan="2"><span>${info}</span></td></tr>`
    : `<tr><th>Sin genero</th></tr>
      <tr><td><img src="${$spritesMale[0]}" alt="sprite sin genero"/></td></tr>
      <tr><td><span>${info}</span></td></tr>`;

  const $sexDifference = document.createElement("section");
  $sexDifference.className = "sex-difference";
  $sexDifference.innerHTML = `
  <h2>Diferencia de sexo</h2>
  <table>
    ${$tbody}
  </table>`;
  return $sexDifference;
}

// Obtener la altura útil de la ventana del navegador
const alturaVentana = window.innerHeight;
console.log(`Altura de la ventana: ${alturaVentana}px`);

// Obtener el ancho útil de la ventana del navegador
const anchoVentana = window.innerWidth;
console.log(`Ancho de la ventana: ${anchoVentana}px`);
