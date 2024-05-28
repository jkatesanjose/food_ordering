function checkout(){
    event.preventDefault();

    var firstName = document.getElementById('firstName').value;
    var lastName = document.getElementById('lastName').value;
    var contactNumber = document.getElementById('contactNumber').value;
    var emailAddress = document.getElementById('emailAddress').value;
    var address = document.getElementById('address').value;
    var deliveryDate = document.getElementById('deliveryDate').value;
    var deliveryTime = document.getElementById('deliveryTime').value;
    var paymentMode = document.getElementById('paymentMode').value;
    var changeFor = document.getElementById('changeFor').value;

    document.getElementById("firstNameErr").style.display = "none";
    document.getElementById("lastNameErr").style.display = "none";
    document.getElementById("contactNumberErr").style.display = "none";
    document.getElementById("emailAddressErr").style.display = "none";
    document.getElementById("addressErr").style.display = "none";
    document.getElementById("deliveryDateErr").style.display = "none";
    document.getElementById("deliveryTimeErr").style.display = "none";
    document.getElementById("paymentModeErr").style.display = "none";
    document.getElementById("changeForErr").style.display = "none";

    let allValidationsPass = true; 

    if (firstName === '' || !nameRegex.test(firstName)) {
        document.getElementById("firstNameErr").style.display = "block";
        return false;
    }
    if (lastName === '' || !nameRegex.test(lastName)) {
        document.getElementById("lastNameErr").style.display = "block";
        return false;
    }
    if (contactNumber === '' || !contactNumberRegex.test(contactNumber)) {
        document.getElementById("contactNumberErr").style.display = "block";
        return false;
    }
    if (emailAddress === '' || !emailAddressRegex.test(emailAddress)) {
        document.getElementById("emailAddressErr").style.display = "block";
        return false;
    }
    if (address === '' || !addressRegex.test(address)) {
        document.getElementById("addressErr").style.display = "block";
        return false;
    }
    const currentDate = new Date().toISOString().split('T')[0];

    if (deliveryDate === '') {
        document.getElementById("deliveryDateErr").style.display = "block";
        return false;
    }
    const selectedDate = new Date(deliveryDate).toISOString().split('T')[0];

    if (selectedDate <= currentDate) {
        document.getElementById("deliveryDateErr").style.display = "block";
        return false;
    }
    if (
        deliveryTime === '' || !timeRegex.test(deliveryTime)) {
        document.getElementById("deliveryTimeErr").style.display = "block";
        return false;
    }
    if (paymentMode === '') {
        document.getElementById("paymentModeErr").style.display = "block";
        return false;
    }
    if (paymentMode === 'cash') {
        if (changeFor === ''){
            document.getElementById("changeForErr").style.display = "block";
            document.getElementById("changeForErr").innerHTML = "Please enter an amount.";
            return false;
        }
    }
    if (allValidationsPass) {

        let orderData = {
            delivery_date: moment(`${deliveryDate} ${deliveryTime}`).format("YYYY-MM-DD HH:MM:SS"),
            payment_method: paymentMode,
            payment_change: parseFloat(changeFor),
            cart_id: parseInt(sessionStorage.getItem("cartID") === null ? 0 : sessionStorage.getItem("cartID"))
        }

        let payload = {
            first_name: firstName,
            last_name: lastName,
            email_add: emailAddress,
            contact_no: contactNumber,
            address: address,
            orderData: orderData
        }

        // console.log(`PAYLOAD = ${JSON.stringify(payload)}`)
        checkoutAPI(payload)
       
      
    }
        
}

function checkoutAPI(payload){
    let url = 'http://localhost:8000/order/addOrder';
    let content = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload),
    };

    api_client(url, content, (response) => {

        console.log(`CHECKOUT API RESPONSE: ${JSON.stringify(response)}`)
        if (response.successful == false){
            alert(response.message)
        }
        else{
            sessionStorage.removeItem("cartID")
            openPopup(response.ref_id)
            // alert(`Successfully placed your order #${response.ref_id}`)
            
            // setTimeout(()=>{
            //     window.location.href = "cart.html"
            // }, 1000)
        }
    })
}