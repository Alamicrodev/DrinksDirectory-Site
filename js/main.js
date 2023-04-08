
// getting main useful elements
let searchBox = document.getElementById("searchBox") 
let isAlcoholicCheck = document.getElementById("alcoholicCheckBox")
let resultsList = document.getElementById("resultsList")

// an array of drinks
let drinks = []


// A function that pushes the drinks into results list. 
function pushDrinks(drinks) {
    // drinks is an array of drinks that came from the api, and we get it in the function below.
    // drinks can also be null if the search returns null from the api. 

    if (drinks == null || drinks.length == 0) {
        resultsList.innerHTML = "<h3>Sorry, Your search brought no results</h3>"
    } 
    else 
    {
        drinks.forEach(drink => {

            // creating elements that represent each element. 
            let listItem = document.createElement("li")
            let listItemImage = document.createElement("img")
            let listItemName = document.createElement("h4")

            
            listItem.onclick = () => {location.href = './drink.html?iddrink='+drink.idDrink } 


            // giving attribute values to elements 
            listItemImage.src = drink.strDrinkThumb
            listItemName.innerText = drink.strDrink
           
    
        
            // adding image, name and button to the list item
            listItem.appendChild(listItemImage)
            listItem.appendChild(listItemName)
            
    
            // adding the list item to the list 
            resultsList.appendChild(listItem);
        });
    }
   
}


// The function that makes the api call
function getDrinks() {
    let query = searchBox.value
    let urlParams = new URLSearchParams({
        "s": query
    })

    // getting from the api
    fetch("https://www.thecocktaildb.com/api/json/v1/1/search.php?"+urlParams).then((resp) => {
        if (resp.ok) {
            return resp.json()
        }
        else {
            console.log("There was some error in getting the data:", resp.status)
        }
    }).then((data) => {
         //gettings drinks array from data  
          drinks = data.drinks 
          let isAlcoholic = !isAlcoholicCheck.checked

          //resetting the last results list   
          resultsList.innerHTML = ""

          //checking for alchololic filter and filtering.
          if (isAlcoholic == true) {
            pushDrinks(drinks)
          }
          else 
          {
            drinks = drinks.filter((drink) => {
                if (drink.strAlcoholic == "Alcoholic") {
                    return false 
                }
                else {
                    return true
                }
            } ) 

           pushDrinks(drinks)
            
          }
    }).catch((err) => {
        console.log("Sorry there was an error in trying to get the data", err)
        resultsList.innerHTML = "<h3>Sorry, It seems like there is an error with the cocktail db API. Please Try Again later :(</h3>"
    })
}


// executing get drinks function on these events 
searchBox.oninput = getDrinks
isAlcoholicCheck.onchange = getDrinks
getDrinks()