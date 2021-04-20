import axios from "axios";


export function getUserLocation(callback) {
    axios.get('https://ipapi.co/json/').then(response => {
        // console.log("res: ", response);
        callback(response.data);
    }).catch(err => {
        console.log("error: ", err);
        alert('Error: ' + err.message);
    })
}