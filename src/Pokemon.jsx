import { useEffect, useState } from 'react';
import './index.css';
import { PokemonCards } from './PokemonCards';

const Pokemon = () => {
    const API = 'https://pokeapi.co/api/v2/pokemon?limit=100';
    const [pokemon, setPokemon] = useState([]);
    const [loading,setLoading] = useState(true);
    const [error,setError] = useState(null);
    const [search, setSearch] = useState('');
    const fetchPokemon = async () => {
        try {
            const res = await fetch(API);
            const data = await res.json();

            // Fetch detailed data for each Pokemon
            const detailedPokemondata = data.results.map(async (curPokemon) => {
                const res = await fetch(curPokemon.url);
                const detailedData = await res.json();
                return detailedData;
            });

            // Wait for all the promises to resolve
            const detailedResponse = await Promise.all(detailedPokemondata);

            // Update the state with the detailed response
            setPokemon(detailedResponse);
            setLoading(false)
        } catch (error) {
            console.log('Error fetching data:', error);
            setLoading(false);
            setError(error);
        }
    };

    useEffect(() => {
        fetchPokemon();
    }, []);

    const searchData = pokemon.filter((curPokemon) =>
        curPokemon.name.toLowerCase().includes(search.toLowerCase())
    );

if(loading){
    return <div><h1>Loading...</h1></div> 
}
    if (error) {
        return <div><h1>{error.message}</h1></div>
    }
    return (
        <div>
            <section className="container">
                <header>
                    <h1>Welcome to the Pokémon App!</h1>
                </header>
                <div className="pokemon-search">
                    <input
                        type="text"
                        placeholder="search Pokemon"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                </div>
                <div>
                    <ul className="cards">
                        {searchData.map((curPokemon) => (
                            <PokemonCards key={curPokemon.id} pokemonData={curPokemon} />
                        ))}
                    </ul>
                </div>
            </section>
        </div>
    );
};

export default Pokemon;
