// getting drink id as passed in the link  
let params = new URLSearchParams(window.location.search)
let drinkId = params.get("iddrink")

console.log(drinkId)

// getting important elements
let title = document.getElementById("drinkTitle")
let image = document.getElementById("drinkImg")
let ingredientsList = document.getElementById("drinkIngredients")
let instructions =  document.getElementById("drinkInstructions")


// creating params to be passed in the request
let newparams = new URLSearchParams({
    "i": drinkId
})

// making request to get drink data 
fetch("https://www.thecocktaildb.com/api/json/v1/1/lookup.php?"+newparams).then((resp) => {
    if (resp.ok) {
        return resp.json()
    }
    else 
    {
        console.log("Sorry we could not get the data from the server",  resp.status)
    }
}).then(
    (data) => {

        // scrapping json to get the drink data 
        let drink = data.drinks[0]
         
        // update page title
        document.title = drink.strDrink 
        
        // putting data in dom 
        title.innerText = drink.strDrink
        image.src = drink.strDrinkThumb
        instructions.innerText = drink.strInstructions

        // putting all the ingredients in an array
        let ingredientsArray = []
        let counter = 1
        while(drink["strIngredient"+counter] != null || drink["strIngredient"+counter] != undefined) {
            ingredientsArray.push(drink["strIngredient"+counter])
            counter++
         }

        // putting all ingredients as list items in ingredients list in dom
        ingredientsArray.forEach((ingredient) => {
            let listItem = document.createElement("li")
            listItem.innerText = ingredient
            ingredientsList.appendChild(listItem)
        })

    }
)
