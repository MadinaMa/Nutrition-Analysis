import { useState } from "react";
import { useEffect } from "react";
import { Terms } from "./Terms";
import { LoaderPage } from "./LoaderPage";
import './App.css';
import './style.css';


function App() {

  const [mySearch, setMySearch] = useState();
  const [requestClicked, setRequestClicked] = useState('');
  const [myTerms, setMyTerms] = useState();
  const [stateLoader, setStateLoader] = useState(false);

  const APP_ID = '3bbc2462';
  const APP_KEY = '0358a4b4434e69b951c177a778b1cc17';
  const APP_URL = 'https://api.edamam.com/api/nutrition-details'

  const fetchData = async (ingr) => {
    setStateLoader(true);

    const response = await fetch(`${APP_URL}?app_id=${APP_ID}&app_key=${APP_KEY}`, {
      method: "POST",
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ ingr: ingr })
    })

    if(response.ok) {
      setStateLoader(false);
      const data = await response.json();
      setMyTerms(data);
    } else {
      setStateLoader(false);
      alert('Please enter ingredients correctly!');
    }
  }

  const myRecipeSearch = e => {
    setMySearch(e.target.value);
  }

  const finalSearch = e => {
    e.preventDefault();
    setRequestClicked(mySearch);
  }

  useEffect(() => {
    if (requestClicked !== '') {
      let ingr = requestClicked.split(/[,,;,\n,\r]/);
      fetchData(ingr);
    }
  }, [requestClicked])


  return (
    <div>
      {stateLoader && <LoaderPage />}
       
       <div className="container">
      <h1>Nutrition Analysis</h1>

      <form onSubmit={finalSearch}>
        <input placeholder="Search..." onChange={myRecipeSearch}/>

        <div className="conatiner">
        <button type="submit"> Go </button>
        </div>

      </form>
      </div>

      <div className="result">
        {
          myTerms && <h2>{myTerms.calories} kcal</h2>
        }
        {
          myTerms && Object.values(myTerms.totalNutrients)
            .map(({ label, quantity, unit }) =>
            
              <Terms 
                label={label.id}
                quantity={quantity}
                unit={unit}
                
              />
            )
        }
      </div>
    </div>
  );
}

export default App;
