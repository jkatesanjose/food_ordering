const menu_model = (name, description, category, price, size, popularity, image)=>{

    let Menu = {
        name: name,
        description: description,
        category: category,
        popularity: popularity,
        image: image
    }
    return Menu
}

module.exports = {
    menu_model
}