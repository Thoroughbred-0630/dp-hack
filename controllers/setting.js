require("dotenv").config();
const axios = require('axios').default;

// Make a request for a user with a given ID


const getGoogleAPIScript = async (req, res) =>{
    try{
        const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
        const url = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_API_KEY}&callback=initMap`;
        var options = {
            url: url,
            method: 'GET'
        }
         
        axios.get(url)
        .then(function (response) {
          // handle success
          res.status(200).json(response.data);
        })
        .catch(function (error) {
          // handle error
          res.status(500).json(error);
        })
        .then(function () {
          // always executed
        });
        // try{
        //     content = await axios.get(url);
        //     json = {"GOOGLE_API_KEY": GOOGLE_API_KEY}
        //     console.log(content);
        //     res.status(200).text(content);

        // }catch(err){
        //     console.log(err);
        //     res.status(500).json(err);
        // }
    }catch(err){
         //ステータス500でjson形式で返す
         res.status(500).json(err);
    }
};

module.exports = {
    getGoogleAPIScript
}
