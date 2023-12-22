const { exec } = require('child_process');
require('dotenv').config();
const cloudinary = require('cloudinary').v2;
const axios = require('axios');

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.API_KEY,
    api_secret: process.env.API_SECRET
});

const takeAndUploadPhoto = async () => {
    const command = `rpicam-jpeg -o photo.jpg -t 500 --width 640 --height 480 --ev 0.5`;
    
        exec(command, (error, stdout, stderr) => {
            if (error) {
                console.error(`Error taking photo: ${error.message}`);
            }
            if (stderr) {
                console.error(`Error: ${stderr}`);
            }
            console.log(`Photo taken and saved as photo.jpg`);
    });

    const result = await cloudinary.uploader.upload("photo.jpg");
    console.log(result.url);
const mlres = await axios.post("http://127.0.0.1:5000/predict",{
"FeedData":[[53.17,10.35,1108.17,441.197,396.862,9.28686,1.56]],"image_url":result.url
})


    const data = {
        oreGrade: 'A',
        silicon: 0.5,
        iron: 0.5,
    };

    const response = await axios.post('http://4.227.178.188:3001/data/photo', {
        ml_detail: JSON.stringify(mlres.data),
        image_url: result.url
    });

    console.log(response.data);
};

takeAndUploadPhoto();
