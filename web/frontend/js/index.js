function getMostPopularItems(){
    let url = "http://localhost:8000/menu/viewMenuByPop"
    let content = {
        method: 'GET',
        headers: {
            
        }
    }

    api_client(url, content, (response)=>{

        if(response.successful == true){
           console.log(response.message)
            let menuItems = response.menuItem
            
            console.log(JSON.stringify(menuItems[0]["name"]))

            letNewHTML = ""

            for (let menu in menuItems){
                console.log(JSON.stringify(menu))
                let el = menuItems[menu]

                letNewHTML += `<div class="Popular_image">
                                <img src="${el["image"]}">

                                <h3>${el["name"]}</h3>
                                <p>${el["description"]}</p>

                                <a href="#Menu" class="Popular_btn">Order Now</a>
                                </div>`
    
            }
            
            document.getElementById("popularContainer").innerHTML = letNewHTML
            // webpageReady()
            // webpageOnLoad()
        }
        
        else{
            console.log(response.message)
            
        }
    })
}

getMostPopularItems()


// MENU 

// function openPopup(id){
//     let popup= document.getElementById(id);
//             popup.classList.add("open-popup")
//         }
// function closePopup(id){
//             let popup= document.getElementById(id);
//             popup.classList.remove("open-popup")
//         }

function addToCart(id){

    console.log(`ADD TO CART id: ${id}`)

    let sel = document.getElementById(`size-item-${id}`)
    let quantity = document.getElementById(`cart-counter-menu-${id}`).value

   

    let selectedSize = sel.options[sel.selectedIndex].getAttribute('name')
    let cart_id = (sessionStorage.getItem("cartID") === null) ? 0 : sessionStorage.getItem("cartID")

    console.log(`ADD TO CART cart_id: ${cart_id}`)
    addToCartAPI(id, selectedSize, quantity, cart_id, (cart_id)=>{
        alert(`Successfully added to cart : ${cart_id}!`)
        let selectedCategory = sessionStorage.getItem("selectedCategory")
        getMenuByCategory(selectedCategory)
    })
    
}

    
function incrementQuantity(id) {
    
    var quantityInput = document.getElementById(id);
    var currentQuantity = parseInt(quantityInput.value, 10);
    quantityInput.value = currentQuantity + 1;
    
}

function decrementQuantity(id) {
    var quantityInput = document.getElementById(id);
    var currentQuantity = parseInt(quantityInput.value, 10);
    if (currentQuantity > 1) {
        quantityInput.value = currentQuantity - 1;
    }
}

function getMenuByCategory(cat){
    sessionStorage.setItem("selectedCategory", cat)
    let cart_id = (sessionStorage.getItem("cartID") === null) ? 0 : sessionStorage.getItem("cartID")

    let url = `http://localhost:8000/menu/viewMenuByCateg/${cat}`
    let content = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cart_id: parseInt(cart_id)
        })
    }

    api_client(url, content, (response)=>{

        if(response.successful == true){
        //    console.log(JSON.stringify(response. category))

            if (response.cart_count > 0){
                showCartBadge(response.cart_count)
            }
            else{
                hideCartBadge()
            }
            let innerHTML = ""
                for (let index in response.category){
                let el = response.category[index]

                innerHTML += `
                <div class="menu_card" data-category="noodle">
                <div class="menu_image">
                    <img src="${el["image"]}">
                </div>
                <div class="menu_info">
                    <h2>${el["name"]}</h2>
                    <p>${el["description"]}</p>
                    <h3 id="menu-item-${el['id']}">₱${(el["cart_rows"].length > 0) ? el["cart_rows"][0].total_amount : el["price_rows"][0].price}</h3>
                    <div class="menu-sq">
                        <ul>
                            <li>
                                <select id="size-item-${el['id']}" class="food-size" onchange="onChangeSelection(${el['id']})">
                            `
                            for (let i in el.price_rows){
                                let ele = el.price_rows[i]

                                if (el["cart_rows"].length > 0){
                                    if (el["cart_rows"][0].size_id == ele.size_id){
                                        innerHTML += `<option name="${ele.size_id}" value="${ele.price}" selected>${ele.size[0]}</option>`
                                    }
                                    else{
                                        innerHTML += `<option name="${ele.size_id}" value="${ele.price}">${ele.size[0]}</option>`
                                    }
                                }
                                else{
                                    innerHTML += `<option name="${ele.size_id}" value="${ele.price}">${ele.size[0]}</option>`
                                }
                                
                            }
                            innerHTML += `</select>
                                <button class="quantity-btn" onclick="incrementQuantity('cart-counter-menu-${el['id']}')">+</button>
                                <input type="text" id="cart-counter-menu-${el['id']}" class="quantity" value="${(el["cart_rows"].length > 0) ? el["cart_rows"][0].quantity : 1}">
                                <button class="quantity-btn" onclick="decrementQuantity('cart-counter-menu-${el['id']}')">-</button>
                            </li>
                        </ul>
                    </div>
                    <a href="#" class="menu_btn" onclick="addToCart(${el['id']})" id="add-to-cart-${el['id']}">${(el["cart_rows"].length > 0) ? 'ADD TO CART': 'ADD TO CART'}</a>
                </div>
            </div>`
                }

            document.getElementById("menu-dish").innerHTML = innerHTML

            // document.getElementsByClassName("menu-size-selection").addEventListener("change", onChangeSelection);
        }
        
        else{
            console.log(response.message)
            
        }
    })
}

getMenuByCategory("all")

function onChangeSelection(id) {
    let selectedIndex = document.getElementById(`size-item-${id}`).selectedIndex;
    let selectedOption = document.getElementById(`size-item-${id}`).options[selectedIndex];
    let selectedSize = selectedOption.getAttribute('name');
    let selectedPrice = selectedOption.value;

    document.getElementById(`menu-item-${id}`).innerHTML = `₱${selectedPrice}`;
}


