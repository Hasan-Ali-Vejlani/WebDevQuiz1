import axios from "axios";
import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [data, setData] = useState({
    name: "",
    description: "",
    ingredients: [],
  });
  const [user, setUser] = useState({ loggedIn: false, token: "" });
  const [recipes, setRecipes] = useState([]);
  const [ingredients, setIngredients] = useState([]);

  const handleForm = (e) =>
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  const signupSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:3001/auth/signUp",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  const loginSubmit = async (e) => {
    try {
      e.preventDefault();
      const res = await axios({
        url: "http://localhost:3001/auth/login",
        method: "post",
        data: data,
      });
      window.alert(res.data.msg);
      if (res.data.token) setUser({ loggedIn: true, token: res.data.token });
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  useEffect(() => {
    if (user.loggedIn && user.token !== "") {
      getRecipes();
      getIngredients(); 
    }
  }, [user]);

  const getRecipes = async () => {
    try {
      const res = await axios({
        url: "http://localhost:3001/recipes", 
        method: "get",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setRecipes(res.data.data);
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  const getIngredients = async () => {
    try {
      const res = await axios({
        url: "http://localhost:3001/ingredients", 
        method: "get",
        headers: { Authorization: `Bearer ${user.token}` },
      });
      setIngredients(res.data.data);
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };

  const handleAddIngredientForm = (e) => {
    const newIngredient = {
      name: e.target.name.value,
      quantity: e.target.quantity.value,
      unit: e.target.unit.value,
    };
    setData((prev) => ({ ...prev, ingredients: [...prev.ingredients, newIngredient] }));
  };

  const handleAddRecipeForm = async (e) => {
    e.preventDefault();
    try {
      const res = await axios({
        url: "http://localhost:3001/recipes", 
        method: "post",
        data: data,
        headers: { Authorization: `Bearer ${user.token}` },
      });
      if (res.data.msg === "RECIPE CREATED") {
        setData({ name: "", description: "", ingredients: [] }); 
        getRecipes();
      }
    } catch (e) {
      console.error(e);
      window.alert("ERROR");
    }
  };
  return (
    <div className="mera-dabba">
      {user.loggedIn ? (
        <div style={{ margin: 50, display: "flex" }}>
          <div style={{ marginRight: 10 }}>
            {recipes.length > 0 ? (
              <div>
                <h1>Your Recipes</h1>
                <ul>
                  {recipes.map((recipe) => (
                    <li key={recipe._id}>
                      <a href={`/recipes/${recipe._id}`}>{recipe.name}</a> {}
                    </li>
                  ))}
                </ul>
              </div>
            ) : (
              <h1>NO RECIPES FOUND</h1>
            )}
          </div>
          <div>
            {/* Recipe Add Form */}
            <form onSubmit={handleAddRecipeForm} style={{ display: "flex", flexDirection: "column" }}>
              <h1>Add Recipe</h1>
              <input
                type="text"
                name="name"
                value={data.name}
                onChange={handleForm}
                style={{ margin: 5 }}
                placeholder="Recipe Name"
              />
              <textarea
                name="description"
                value={data.description}
                onChange={handleForm}
                style={{ margin: 5 }}
                placeholder="Recipe Description"
              />
  
              <h2>Ingredients</h2>
              {data.ingredients.length > 0 && (
                <ul>
                  {data.ingredients.map((ingredient) => (
                    <li key={ingredient.name}>
                      {ingredient.quantity} {ingredient.unit} - {ingredient.name}
                    </li>
                  ))}
                </ul>
              )}
  
              <div style={{ display: "flex" }}>
                <input
                  type="text"
                  name="name"
                  placeholder="Ingredient Name"
                  style={{ margin: 5, flex: 1 }}
                  onChange={handleAddIngredientForm}
                />
                <input
                  type="number"
                  name="quantity"
                  placeholder="Quantity"
                  style={{ margin: 5, width: 50 }}
                  onChange={handleAddIngredientForm}
                />
                <input
                  type="text"
                  name="unit"
                  placeholder="Unit (e.g., cups, ml)"
                  style={{ margin: 5, flex: 1 }}
                  onChange={handleAddIngredientForm}
                />
              </div>
  
              <button type="submit">Add Recipe</button>
            </form>
          </div>
        </div>
      ) : (
        <>
          {/* Login/Signup Forms */}
          <div style={{ margin: 50 }}>
            <form onSubmit={signupSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <h1>Signup</h1>
              <input type="text" name="name" value={data.name} onChange={handleForm} style={{ margin: 5 }} placeholder="Name" />
              <input type="text" name="email" data={data.email} onChange={handleForm} style={{ margin: 5 }} placeholder="Email" />
              <input type="password" name="password" value={data.password} onChange={handleForm} style={{ margin: 5 }} placeholder="Password" />
              <button type="submit">Submit</button>
            </form>
          </div>
          <div>
            <form onSubmit={loginSubmit} style={{ display: "flex", flexDirection: "column" }}>
              <h1>Login</h1>
              <input type="text" name="email" data={data.email} onChange={handleForm} style={{ margin: 5 }} placeholder="Email" />
              <input type="password" name="password" value={data.password} onChange={handleForm} style={{ margin: 5 }} placeholder="Password" />
              <button type="submit">Submit</button>
            </form>
          </div>
        </>
      )}
    </div>
  );
      }

      export default App;