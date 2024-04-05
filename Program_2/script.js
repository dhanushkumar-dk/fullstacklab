
        const api_url = "https://api.sampleapis.com/coffee/hot";
        // Defining async function

        async function getapi(url) {
            // Storing response
            const response = await fetch(url);
            // Storing data in form of JSON
            var data = await response.json();
            console.log(data);
            if (response) {
                hideloader();
            }
            show(data);
        }

        // Calling that async function
        getapi(api_url);
        // Function to hide the loader
        function hideloader() {
            document.getElementById('loading').style.display = 'none';
        }

        // Function to define innerHTML for HTML table
        
        
        function show(data) {
        let tab =`<tr>
                    <th id="th">Title</th>
                    <th id="th">Description</th>
                    <th id="th">Ingredients</th>
                    <th id="th">Image</th>
                  </tr>`;
                  
        // Loop to access all rows
        for (let r of data) {
        tab += 
            `<tr>
                <td id="td1">${r.title} </td>
                <td id="td2">${r.description}</td>
                <td id="td3">${r.ingredients}</td>
                <td id="td4"><img src=${r.image} alt="image not found" style="heigh:100px; width:200px"></img></td>
            </tr>`;
        }

        // Setting innerHTML as tab variable
        document.getElementById("employees").innerHTML = tab;
        }