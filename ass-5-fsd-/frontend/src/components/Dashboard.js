import React, { useEffect, useState } from "react";
import RecipeForm from "./RecipeForm";
import RecipeList from "./RecipeList";
import "./Dashboard.css";

const Dashboard = () => {
  const [activeTab, setActiveTab] = useState("recipes");
  const [recipes, setRecipes] = useState([]);

  // Load recipes from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem("recipes");
      if (stored) {
        setRecipes(JSON.parse(stored));
      }
    } catch (e) {
      // ignore corrupt storage
      setRecipes([]);
    }
  }, []);

  // Persist to localStorage whenever recipes change
  useEffect(() => {
    localStorage.setItem("recipes", JSON.stringify(recipes));
  }, [recipes]);

  const addRecipe = (recipe) => {
    const newRecipe = { id: crypto.randomUUID(), ...recipe };
    setRecipes((prev) => [newRecipe, ...prev]);
    setActiveTab("recipes");
  };

  const deleteRecipe = (id) => {
    setRecipes((prev) => prev.filter((r) => r.id !== id));
  };

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <h1>🍲 Recipe Dashboard</h1>
        <p>Manage your recipes in a colorful and elegant interface</p>
      </header>

      <div className="tabs">
        <button
          className={`tab-btn ${activeTab === "recipes" ? "active" : ""}`}
          onClick={() => setActiveTab("recipes")}
        >
          🍛 Recipes
        </button>
        <button
          className={`tab-btn ${activeTab === "add" ? "active" : ""}`}
          onClick={() => setActiveTab("add")}
        >
          ➕ Add Recipe
        </button>
        <button
          className={`tab-btn ${activeTab === "profile" ? "active" : ""}`}
          onClick={() => setActiveTab("profile")}
        >
          👤 Profile
        </button>
      </div>

      <div className="dashboard-content">
        {activeTab === "recipes" && (
          <RecipeList recipes={recipes} onDelete={deleteRecipe} />
        )}
        {activeTab === "add" && <RecipeForm onAdd={addRecipe} />}
        {activeTab === "profile" && (
          <div className="profile-card">
            <img
              src="https://cdn-icons-png.flaticon.com/512/2922/2922506.png"
              alt="User"
            />
            <div>
              <h3> Atharv</h3>
              <p>Email: atharv@gmail.com</p>
              <p>Joined: October 2025</p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
