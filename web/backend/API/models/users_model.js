const user_model = (first_name, last_name, email_add, contact_no, address)=>{

    let User = {
        first_name: first_name,
        last_name: last_name,
        email_add: email_add,
        contact_no: contact_no,
        address: address
    }
    return User
}

module.exports = {
    user_model
}