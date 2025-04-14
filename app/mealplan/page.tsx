import React from "react";

const MealPlanDashboard = () => {
  return (
    <div>
      <div>
        <div>
          <h1>Meal Plan Generator</h1>
          <form action="">
            <div>
              <label htmlFor="dietType">Diet Type</label>
              <input
                type="text"
                id="dietType"
                name="dietType"
                required
                placeholder="e.g vegan, keto, vegetarian..."
              />
            </div>
            <div>
              <label htmlFor="calories">Daily Calory Goal</label>
              <input
                type="number"
                id="calories"
                name="calories"
                required
                min={500}
                max={15000}
                placeholder="e.g. 2000"
              />
            </div>
            <div>
              <label htmlFor="allergies">Allergies</label>
              <input type="text" id="allergies" name="allergies" placeholder="e.g nuts, dairy" />
            </div>
            <div>
              <label htmlFor="cuisine">Preferred cuisine</label>
              <input
                type="text"
                id="cuisine"
                name="cuisine"
                placeholder="e.g american, italian"
              />
            </div>
            <div>
              <input type="checkbox" id="snacks" name="snacks" />
              <label htmlFor="snacks">Include snacks</label>
            </div>
            <div>
              <button type="submit">Generate My Menu</button>
            </div>
          </form>
        </div>
        <div>
          <h2>Weekly Menu</h2>
        </div>
      </div>
    </div>
  );
};

export default MealPlanDashboard;
