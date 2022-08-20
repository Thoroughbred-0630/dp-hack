
const getAPIKey = async () =>{
    try{
        var GOOGLE_API_KEY;
        const {data} = await axios.get("/api/v1/setting");
        eval(data);
    }catch(err){
        console.log(err);
    }
    
}

window.onload = function() {
    getAPIKey();
}