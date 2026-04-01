
// getting main useful elements
let searchBox = document.getElementById("searchBox") 
let isAlcoholicCheck = document.getElementById("alcoholicCheckBox")
let resultsList = document.getElementById("resultsList")
let resultsHeading = document.querySelector("#mainContent h2")

// an array of drinks
let drinks = []
let featuredLetters = ["a", "m", "s"]


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

// fetches drinks from a given API url and always returns an array
async function fetchDrinks(url) {
    let resp = await fetch(url)

    if (!resp.ok) {
        throw new Error("Request failed with status " + resp.status)
    }

    let data = await resp.json()
    return data.drinks || []
}

// removes duplicate drinks by id
function uniqueDrinks(drinks) {
    let seen = new Set()

    return drinks.filter((drink) => {
        if (seen.has(drink.idDrink)) {
            return false
        }

        seen.add(drink.idDrink)
        return true
    })
}

// applies the alcohol filter used by the checkbox
function filterDrinks(drinks) {
    if (isAlcoholicCheck.checked) {
        return drinks.filter((drink) => drink.strAlcoholic !== "Alcoholic")
    }

    return drinks
}

// The function that makes the api call
async function getDrinks() {
    let query = searchBox.value.trim()

    try {
        let fetchedDrinks = []

        if (query === "") {
            resultsHeading.innerText = "Featured Drinks:"

            let featuredResults = await Promise.allSettled(
                featuredLetters.map((letter) => {
                    let urlParams = new URLSearchParams({ f: letter })
                    return fetchDrinks("https://www.thecocktaildb.com/api/json/v1/1/search.php?" + urlParams)
                })
            )

            fetchedDrinks = uniqueDrinks(
                featuredResults
                    .filter((result) => result.status === "fulfilled")
                    .map((result) => result.value)
                    .flat()
            )
        }
        else {
            resultsHeading.innerText = "Results:"

            let urlParams = new URLSearchParams({
                s: query
            })

            fetchedDrinks = await fetchDrinks("https://www.thecocktaildb.com/api/json/v1/1/search.php?" + urlParams)
        }

        drinks = filterDrinks(fetchedDrinks)

        // resetting the last results list
        resultsList.innerHTML = ""
        pushDrinks(drinks)
    }
    catch (err) {
        console.log("Sorry there was an error in trying to get the data", err)
        resultsList.innerHTML = "<h3>Sorry, It seems like there is an error with the cocktail db API. Please Try Again later :(</h3>"
    }
}


// executing get drinks function on these events 
searchBox.oninput = getDrinks
isAlcoholicCheck.onchange = getDrinks
getDrinks()
