const exporess = require("express");
require("dotenv").config();

const app = exporess();
const PORT = process.env.PORT || 5000;
// console.log(PORT);
// console.log(`access port ${PORT}`);
app.use(exporess.json());
app.use(exporess.static("./frontend"));
const settingRoute = require("./routes/setting");
app.use("/api/v1/setting", settingRoute)



const start = async () => {
    try{
        app.listen(PORT, console.log("サーバーが起動しました"));
    }catch(err){
        console.log(err)
    }
};

start();