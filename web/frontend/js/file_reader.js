

function readFileFn(file, callback) {
    
    const reader = new FileReader();
  
  
    if (file) {
      reader.readAsDataURL(file);
      reader.addEventListener('load', ()=>{
        const url = reader.result
        callback(url)
      })
      
    }
  }

  function uploadImage(){
    const file = document.getElementById("image").files[0];
    readFileFn(file, (url)=>{
        //THIS IS THE URL OF THE IMAGE TO BE INSERTED IN THE DATABASE

        console.log(url)
    })
  }

  function insertImageAPI(payload){
    let url = `http://localhost:8000/test/insert-image`;

    let content = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
    }

    api_client(url, content, (response) => {
        if (response.successful){


            console.log(JSON.stringify(response))
        }
    })
  }
  //HOW TO FETCH MULTIPLE IMAGE FROM THE API
  function fetchImageAPI(){
    let url = `http://localhost:8000/test/fetch-image`;

    let content = {
        method: 'GET'
    }

    api_client(url, content, (response) => {
        if (response.successful){

            let innerHTML = ""
            for (let index in response.data){
                let item = response.data[index]
                innerHTML += `<img src="${item.img_url}">`
            }

            document.getElementById("imageHolder").innerHTML = innerHTML

            console.log(JSON.stringify(response.data))
        }
    })
  }


function getProducts(){
  let url = `http://localhost:8000/menu/viewMenuByCateg/all`;

    let content = {
        method: 'GET'
    }

    api_client(url, content, (response) => {
        if (response.successful){

            console.log(JSON.stringify(response.category))
        }
    })
}