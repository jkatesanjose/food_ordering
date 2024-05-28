function addToCartAPI(menu_id, menu_size, quantity, cart_id, callback) {
    let url = 'http://localhost:8000/cart/addToCart';
    let content = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            menu_id: menu_id,
            menu_size: menu_size,
            quantity: quantity,
            cart_id: parseInt(cart_id)
        })
    }

    api_client(url, content, (response) => {
        if (response.successful == true) {
            sessionStorage.setItem("cartID", response.cart_id)
            callback(response.cart_id)
            
            
        } else {
            console.log(response.message);
        }
    })
}

function updateCartItemAPI(id, menu_size, quantity, callback){
    let url = 'http://localhost:8000/cart/updateCartItem';
    let content = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id,
            menu_size: menu_size,
            quantity: quantity
        })
    }

    api_client(url, content, (response) => {
        if (response.successful == true) {
            callback()
            
            
        } else {
            console.log(response.message);
        }
    })
}

function removeCartItemAPI(id, callback){
    let url = 'http://localhost:8000/cart/deleteCartItem';
    let content = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: id
        })
    }

    api_client(url, content, (response) => {
        if (response.successful == true) {
            callback(response.message)
            
            
        } else {
            alert(response.message)
            console.log(response.message);
        }
    })
}

function updateCartItem(id){
    console.log(`UPDATE CART id: ${id}`);

    let sel = document.getElementById(`cart-item-${id}`);
    let quantity = document.getElementById(`cart-item-qty-${id}`).value;
    let selectedSize = sel.options[sel.selectedIndex].getAttribute('name');

    if (quantity < 1){
        // DISPLAY CONFIRMATION MESSAGE AND CALL REMOVE API
        alert("Please enter a valid value");
    } else {
        updateCartItemAPI(id, selectedSize, quantity, () => {
            viewCart();
        });
    }
}


function removeCartItem(id){
    console.log(`DELETE CART id: ${id}`)

    removeCartItemAPI(id, (message)=>{

        viewCart()
    })
   


}

function viewCart(){
    let cart_id = (sessionStorage.getItem("cartID") === null) ? 0 : sessionStorage.getItem("cartID");

    console.log(`SESSION STORAGE CART ID = ${cart_id}`);
    let url = 'http://localhost:8000/cart/viewCart';
    let content = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            cart_id: parseInt(cart_id),
        }),
    };

    api_client(url, content, (response) => {
        if (response.successful == true) {
            if (response.cart_items.length == 0){
                document.getElementById("totalPrice").innerHTML = `<b>${0.00}</b>`;
                alert("You have no cart items!");
                hideCartBadge();
            } else {
                showCartBadge(response.total_count);
                let formattedPrice = response.total_amount.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
                document.getElementById("totalPrice").innerHTML = `<b>${formattedPrice}</b>`;

                let innerHTML = ``;
                let grandTotal = 0; // Initialize grand total

                for (let i in response.cart_items){
                    let el = response.cart_items[i];
                    let subtotal = el['price'] * el['quantity'];
                    grandTotal += subtotal; // Accumulate subtotal for grand total

                    innerHTML += `
                    <div class="cart-item">
                <div class="cart-column"> 
                    <img src="${el['image']}" alt="Product Image">
                </div>
                <div class="cart-column">${el['name']}</div>
                <div class="cart-column">
                    <select id="cart-item-${el['cart_id']}" class="size-dropdown" onchange="updateCartItem(${el['cart_id']})">
                    `;
                    for (let i in el.price_rows){
                        let ele = el.price_rows[i];

                        if (el["menu_size"] == ele.size_id){
                            innerHTML += `
                            <option name="${ele.size_id}" value="${ele.price}" selected>${ele.size}</option>
                            `;
                        }
                        else{
                            innerHTML += `
                            <option name="${ele.size_id}" value="${ele.price}">${ele.size}</option>`;
                        }
                    }
                    innerHTML += `</select>
                </div>
                <div class="cart-column">₱${el['price']}</div>
                <div class="cart-column">
                    <input type="number" value="${el['quantity']}" min="1" class="cartquantity" id="cart-item-qty-${el['cart_id']}" onchange="updateSubtotal(${el['cart_id']}, ${el['price']})">
                </div>
                <div class="cart-column" id="cart-subtotal-${el['cart_id']}">₱${subtotal}</div>
                        <div class="cart-column">
                            <button class="update-btn" onclick="updateCartItem(${el["cart_id"]})">Update</button>
                        </div>
                        <div class="cart-column">
                            <button class="remove-btn" onclick="removeCartItem(${el["cart_id"]})">Remove</button>
                        </div>
                    </div>
                    `;
                }

                document.getElementById("cart-items").innerHTML = innerHTML;

                // Display grand total
                let formattedGrandTotal = grandTotal.toLocaleString("en-US", { maximumFractionDigits: 2, minimumFractionDigits: 2 });
                document.getElementById("totalPrice").innerHTML = `${formattedGrandTotal}`;
            }
        } else {
            console.log(response.message);
        }
    });
}

function hideCartBadge(){

    let list = document.getElementsByClassName("cart-number")

    // console.log(`list total = ${list[0].getAttribute("class")}`)
    for (let el=0; el<list.length; el++){
        if (list[el].classList.contains("d-flex") == true){
            list[el].classList.remove('d-flex')
        }
        
        list[el].classList.add("d-none")
    }
}

function showCartBadge(count){

    let list = document.getElementsByClassName("cart-number")
    // console.log(`list total = ${list.length}`)
    // console.log(`list total = ${list[0].getAttribute("class")}`)
    for (let el=0; el<list.length; el++){
        if (list[el].classList.contains("d-none") == true){
            list[el].classList.remove('d-none')
        }
        list[el].classList.add("d-flex")
        list[el].innerHTML = count

    }
}

function updateTotalPrice(id){
    document.getElementById(`cart-price-${id}`).innerHTML = "₱"+(document.getElementById(`cart-item-${id}`).value)*(document.getElementById(`cart-item-qty-${id}`).value)
}

function updateSubtotal(cartId, price) {
    let quantity = document.getElementById(`cart-item-qty-${cartId}`).value;
    let subtotal = price * quantity;
    document.getElementById(`cart-subtotal-${cartId}`).innerHTML = `₱${subtotal}`;
}