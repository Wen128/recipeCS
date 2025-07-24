import { useState, useEffect } from 'react';

function App() {
  // Ingredients with icons
  const allIngredients = [
    { name: 'Chicken', icon: '🍗' },
    { name: 'Beef', icon: '🥩' },
    { name: 'Pork', icon: '🐖' },
    { name: 'Eggs', icon: '🥚' },
    { name: 'Tomato', icon: '🍅' },
    { name: 'Potato', icon: '🥔' },
    { name: 'Carrot', icon: '🥕' },
    { name: 'Onion', icon: '🧅' },
    { name: 'Garlic', icon: '🧄' },
    { name: 'Rice', icon: '🍚' },
    { name: 'Noodles', icon: '🍜' },
    { name: 'Bell Pepper', icon: '🫑' },
    { name: 'Mushroom', icon: '🍄' },
    { name: 'Spinach', icon: '🥬' },
    { name: 'Cheese', icon: '🧀' },
    { name: 'Milk', icon: '🥛' },
    { name: 'Bread', icon: '🍞' },
    { name: 'Tofu', icon: '🥟' },
    { name: 'Fish', icon: '🐟' }
  ];

  const [selectedIngredients, setSelectedIngredients] = useState([]);
  const [customIngredient, setCustomIngredient] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [recipes, setRecipes] = useState([]);
  const [favorites, setFavorites] = useState([]);

  // Load favorites from localStorage
  useEffect(() => {
    const saved = localStorage.getItem('favoriteRecipes');
    if (saved){
      setFavorites(JSON.parse(saved));
    }else{
      localStorage.setItem('favoriteRecipes', favorites);
    }
  }, [favorites]);


  const toggleIngredient = (ingredient) => {
    setSelectedIngredients(prev => 
      prev.includes(ingredient)
        ? prev.filter(item => item !== ingredient)
        : [...prev, ingredient]
    );
  };

  const addCustomIngredient = () => {
    if (customIngredient.trim() && !selectedIngredients.includes(customIngredient)) {
      setSelectedIngredients([...selectedIngredients, customIngredient]);
      setCustomIngredient('');
    }
  };

  const toggleFavorite = (recipe) => {
    if (favorites.some(fav => fav.title === recipe.title)) {
      setFavorites(favorites.filter(fav => fav.title !== recipe.title));
      localStorage.setItem('favoriteRecipes', favorites);

    } else {
      setFavorites([...favorites, recipe]);
      localStorage.setItem('favoriteRecipes', favorites);

    }
  };

  const generateRecipes = async () => {
    if (selectedIngredients.length === 0) return;
    
    setIsLoading(true);
    console.log("seleced ingre", selectedIngredients);
    
    try {
      const response = await fetch('https://recipebackend-oo1a.onrender.com/api/generate-recipes', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          ingredients: selectedIngredients
        })
      });

      if (!response.ok) throw new Error("API request failed");
      
      const recipes = await response.json();
      setRecipes(recipes);
    } catch (error) {
      console.error("Error calling API:", error);
      window.alert("Failed to generate recipes.");
    } finally {
      setIsLoading(false);
      setSelectedIngredients([]);
    }
  }

  return (
    <div className="min-h-screen bg-amber-900 font-serif bg-tavern-texture">
      {/* Tavern Sign */}
      <div className="bg-amber-800 py-8 border-y-4 border-amber-600 shadow-lg">
        <div className="container mx-auto text-center">
          <h1 className="text-5xl font-bold text-amber-100 mb-2">
            <span className="text-red-400">Dragon's</span> <span className="text-yellow-300">Kitchen</span>
          </h1>
          <p className="text-xl text-amber-200">Fantasy Tavern Recipe Generator</p>
        </div>
      </div>

      <main className="container mx-auto px-4 py-8 max-w-4xl relative z-10">
        {/* Ingredient Selection - Tavern Style */}
        <div className="bg-amber-700 bg-opacity-90 rounded-lg p-6 shadow-xl border-2 border-amber-500 mb-8">
          <h2 className="text-2xl font-bold mb-4 text-amber-100 flex items-center">
            <span className="text-amber-300 mr-2">⚔️</span> Choose Your Ingredients
          </h2>
          
          <div className="flex flex-wrap gap-3 mb-6">
            {allIngredients.map((item, index) => (
              <button
                key={index}
                onClick={() => toggleIngredient(item.name)}
                className={`px-4 py-2 rounded-md border-2 transition-all flex items-center ${
                  selectedIngredients.includes(item.name)
                    ? 'bg-amber-600 border-amber-300 text-white shadow-inner'
                    : 'bg-amber-800 border-amber-600 text-amber-100 hover:bg-amber-700'
                }`}
              >
                <span className="mr-2">{item.icon}</span>
                {item.name}
              </button>
            ))}
          </div>

          {/* Custom Ingredient Input */}
          <div className="mb-6">
            <h3 className="text-lg text-amber-200 mb-2">Add Custom Ingredient:</h3>
            <div className="flex">
              <input
                type="text"
                value={customIngredient}
                onChange={(e) => setCustomIngredient(e.target.value)}
                placeholder="Type ingredient..."
                className="flex-1 px-4 py-2 rounded-l-md bg-amber-100 text-amber-900 border-2 border-r-0 border-amber-600"
              />
              <button
                onClick={addCustomIngredient}
                className="px-4 py-2 bg-amber-600 text-white rounded-r-md border-2 border-amber-600 hover:bg-amber-700"
              >
                Add
              </button>
            </div>
          </div>

          <div className='mb-6'>
            <p className="text-lg text-amber-200 mb-2">
              Selected: {selectedIngredients.length > 0 ? selectedIngredients.join(', ') : 'No ingredients selected yet'}
            </p>
          </div>
          
          <button
            onClick={generateRecipes}
            disabled={selectedIngredients.length === 0}
            className={`px-8 py-3 bg-gradient-to-r from-red-700 to-amber-700 text-white rounded-lg font-bold ${
              selectedIngredients.length === 0 
                ? 'opacity-50 cursor-not-allowed' 
                : 'hover:from-red-800 hover:to-amber-800 transform hover:scale-105'
            } transition-all flex items-center mx-auto shadow-lg`}
          >
            <span className="mr-2">✨</span> Generate Recipes
          </button>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="text-center py-12 bg-amber-800 bg-opacity-70 rounded-lg border-2 border-amber-600">
            <div className="inline-flex flex-col items-center">
              <div className="w-12 h-12 border-4 border-amber-300 border-t-transparent rounded-full animate-spin mb-4"></div>
              <p className="text-amber-200 text-lg">The tavern chef is cooking...</p>
            </div>
          </div>
        )}

        {/* Recipe Display - Parchment Style */}
        {recipes.length > 0 && (
          <div className="space-y-8">
            <h2 className="text-3xl font-bold text-amber-100">Generated Recipes</h2>
            
            {recipes.map((recipe, index) => {
              const isFavorite = favorites.some(fav => fav.title === recipe.title);
              
              return (
                <div key={index} className="bg-amber-100 bg-opacity-90 rounded-lg p-6 shadow-lg border-2 border-amber-300 relative">
                  {/* Favorite Button */}
                  <button
                    onClick={() => toggleFavorite(recipe)}
                    className={`absolute top-4 right-4 text-2xl ${
                      isFavorite ? 'text-red-500' : 'text-gray-400'
                    }`}
                  >
                    {isFavorite ? '❤️' : '🤍'}
                  </button>
                  
                  <h3 className="text-2xl font-bold mb-2 text-amber-900 border-b-2 border-amber-700 pb-2">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-amber-800">
                    <span className="flex items-center">
                      <span className="text-amber-600 mr-1">⭐</span> {recipe.difficulty}
                    </span>
                    <span className="flex items-center">
                      <span className="text-amber-600 mr-1">⏳</span> {recipe.time}
                    </span>
                    <span className="flex items-center">
                      <span className="text-amber-600 mr-1">💰</span> {recipe.cost}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                      <span className="text-amber-700 mr-2">📜</span> Ingredients
                    </h4>
                    <ul className="grid grid-cols-2 gap-2 text-amber-900">
                      {recipe.ingredients.map((item, i) => (
                        <li key={i} className="flex">
                          <span className="text-amber-700 mr-2">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                      <span className="text-amber-700 mr-2">🍳</span> Steps
                    </h4>
                    <ol className="space-y-2 text-amber-900">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="flex">
                          <span className="font-bold text-amber-700 mr-2">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                      <span className="text-amber-700 mr-2">💪</span> Nutrition
                    </h4>
                    <p className="text-amber-900">{recipe.nutrition}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Favorites Section */}
        {favorites.length > 0 && (
          <div className="mt-12">
            <h2 className="text-3xl font-bold text-amber-100 mb-6">Your Favorite Recipes</h2>
            <div className="space-y-8">
              {favorites.map((recipe, index) => (
                <div key={`fav-${index}`} className="bg-amber-100 bg-opacity-90 rounded-lg p-6 shadow-lg border-2 border-amber-300 relative">
                  
                  <button
                    onClick={() => toggleFavorite(recipe)}
                    className="absolute top-4 right-4 text-2xl text-red-500"
                  >
                    ❤️
                  </button>
                  
                  <h3 className="text-2xl font-bold mb-2 text-amber-900 border-b-2 border-amber-700 pb-2">
                    {recipe.title}
                  </h3>
                  
                  <div className="flex flex-wrap gap-4 mb-3 text-sm text-amber-800">
                    <span className="flex items-center">
                      <span className="text-amber-600 mr-1">⭐</span> {recipe.difficulty}
                    </span>
                    <span className="flex items-center">
                      <span className="text-amber-600 mr-1">⏳</span> {recipe.time}
                    </span>
                    <span className="flex items-center">
                      <span className="text-amber-600 mr-1">💰</span> {recipe.cost}
                    </span>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                      <span className="text-amber-700 mr-2">📜</span> Ingredients
                    </h4>
                    <ul className="grid grid-cols-2 gap-2 text-amber-900">
                      {recipe.ingredients.map((item, i) => (
                        <li key={i} className="flex">
                          <span className="text-amber-700 mr-2">-</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                  
                  <div className="mb-4">
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                      <span className="text-amber-700 mr-2">🍳</span> Steps
                    </h4>
                    <ol className="space-y-2 text-amber-900">
                      {recipe.steps.map((step, i) => (
                        <li key={i} className="flex">
                          <span className="font-bold text-amber-700 mr-2">{i + 1}.</span>
                          <span>{step}</span>
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-bold text-amber-800 mb-2 flex items-center">
                      <span className="text-amber-700 mr-2">💪</span> Nutrition
                    </h4>
                    <p className="text-amber-900">{recipe.nutrition}</p>
                  </div>
                  
                  {/* Rest of favorite recipe display */}
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* Tavern Footer */}
      <footer className="bg-amber-800 py-4 border-t-4 border-amber-600 mt-8 text-center text-amber-300">
        <p>"Good food is the foundation of real happiness" — Tavern Master</p>
      </footer>
    </div>
  );
}

export default App;
