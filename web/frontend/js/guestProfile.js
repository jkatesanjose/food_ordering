function guestProfile(){
    let firstName = document.getElementById("firstName").value
    let lastName = document.getElementById("lastName").value
    let emailAdd = document.getElementById("emailAdd").value
    let contactNo = document.getElementById("contact_no").value
    let address = document.getElementById("address").value

    console.log(`First Name = ${firstName}`)
    console.log(`Last Name = ${lastName}`)
    console.log(`Email Address = ${emailAdd}`)
    console.log(`Contact No = ${contactNo}`)
    console.log(`Address = ${address}`)

    if(firstName == "" || lastName == "" || emailAdd == "" || contactNo == "" || address == ""){
        alert("Please enter required fields.")
    }
    else{
        let payload = {
            first_name: firstName,
            last_name: lastName,
            email_add: emailAdd,
            contact_no: contactNo,
            address: address
        }
        profileRequest(payload)
    }
}

function profileRequest(payload){
    let url = "http://localhost:8000/users/guest"

    let content = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    api_client(url, content, (response)=>{
        if(response.successful == true){
            alert(response.message)
        }
        else{
            alert(response.message)
        }
    })
}
