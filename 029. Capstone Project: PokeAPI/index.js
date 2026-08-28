import express from 'express';
import axios from 'axios';
import bodyParser from 'body-parser';

const app = express();
const port = 3000;
const baseUrl = 'https://pokeapi.co/api/v2';
let pokemon;

app.use(express.static('public'));

const getRandomId = () => {
  return Math.floor(Math.random() * 1025) + 1;
};

const getRandomPokemon = async () => {
  try {
    const response = await axios.get(`${baseUrl}/pokemon/${getRandomId()}`);
    return response.data;
  } catch (error) {
    console.log(error);
  }
};

const getRandomAbility = (abilities) => {
  return abilities[Math.floor(Math.random() * abilities.length)];
};

app.get('/', (req, res) => {
  res.render('index.ejs', { pokemon: pokemon });
});

app.post('/random-pokemon', async (req, res) => {
  const pokemonData = await getRandomPokemon();

  const sprite = pokemonData.sprites.front_default;
  console.log('SPRITE: ' + sprite);

  const name = pokemonData.name;
  console.log('NAME: ' + name);

  const randomAbility = getRandomAbility(pokemonData.abilities);
  console.log('ABILITY: ' + randomAbility.ability.name);

  const cry = pokemonData.cries.latest;
  console.log('CRY: ' + cry);

  pokemon = {
    sprite: sprite,
    name: name,
    ability: randomAbility.ability.name,
    cry: cry,
  };

  res.redirect('/');
});
app.listen(port, () => {
  console.log(`Server started at http://localhost:${port}`);
});
