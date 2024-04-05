import express from "express";
import axios from "axios";
import bodyParser from "body-parser";

const app = express();
const port = 3000;
const API_Key = 'openuv-1k33arlumx0r6u-io';
const API_URL = 'https://api.openuv.io/api/v1/uv?';
let lat = 28.5;
let lng = 77.1;
let uv_status = 'low 😇';

app.use(express.static('public'));
app.use(bodyParser.urlencoded({ extended: true }));

function date(str){
    let dateTime = new Date(str);
      
    // Extracting uv date components
    let year = dateTime.getFullYear();
    let month = dateTime.getMonth() + 1; // Month starts from 0, so we add 1
    let date = dateTime.getDate();
    
    let date_str = `${year}-${month}-${date}`;
    return date_str;
}

function time(str){
    let dateTime = new Date(str);

    // Extracting uv time components
    let hours = dateTime.getHours();
    let minutes = dateTime.getMinutes();
    let seconds = dateTime.getSeconds();

    let time_str = `${hours}:${minutes}:${seconds}`;
    return time_str;
}

function uvStatus(uv_idx){
    if(uv_idx <= 2)
        uv_status = 'low 😇';

    else if(uv_idx <= 5)
        uv_status = 'moderate 😊';

    else if(uv_idx <= 7)
        uv_status = 'high 😥';

    else if(uv_idx <= 10)
        uv_status = 'very high 😰';

    else
        uv_status = 'extreme 😨';

    return uv_status;
}   

app.get('/', (req, res)=>{
    res.render('index.ejs');
});

app.get('/uvform', (req, res)=>{
    res.render('form.ejs',{
    })
});

app.get('/india', (req, res)=>{
    lat = 28.656861;
    lng = 77.237087;
    res.redirect('/uvreport');
});

app.get('/france', (req, res)=>{
    lat = 48.8566;
    lng = 2.3522;
    res.redirect('/uvreport');
});

app.get('/usa', (req, res)=>{
    lat = 38.899387;
    lng = -77.038371;
    res.redirect('/uvreport');
});

app.get('/uae', (req, res)=>{
    lat = 24.426492;
    lng = 54.591510;
    res.redirect('/uvreport');
});

app.get('/sa', (req, res)=>{
    lat = -33.943667;
    lng = 18.524979;
    res.redirect('/uvreport');
});

app.get('/argentina', (req, res)=>{
    lat = -34.566335;
    lng = -58.423346;
    res.redirect('/uvreport');
});

app.post('/location', (req, res)=>{
    lat = req.body.latitude;
    lng = req.body.longitude;
    res.redirect('/uvreport');
});

app.get('/uvreport', async (req, res) => { 
    const config = {
        method: 'get',
        url: `${API_URL}lat=${lat}&lng=${lng}`,
        headers: { 
            'x-access-token': API_Key,
            'Content-Type': 'application/json'
        }
    };
    
    try {
      const response = await axios(config);
      console.log(response.data);

      let uv_idx = response.data.result.uv;
      let uv_max = response.data.result.uv_max;

      let uv_time_str = response.data.result.uv_time;
      let uvmax_time_str = response.data.result.uv_max_time;
      let uv_date = date(uv_time_str);
      let uv_time = time(uv_time_str);
      let uvmax_date = date(uvmax_time_str);
      let uvmax_time = time(uvmax_time_str);
      let uv_st = uvStatus(uv_idx);
      
      let ozone = response.data.result.ozone;
      let ozone_time_str = response.data.result.ozone_time;
      let ozone_date = date(ozone_time_str);
      let ozone_time = time(ozone_time_str);

      res.render('report.ejs', {
        uv_idx: uv_idx,
        uv_max: uv_max,
        uv_date: uv_date,
        uv_time: uv_time,
        uv_st: uv_st,
        uvmax_date: uvmax_date,
        uvmax_time: uvmax_time,
        ozone: ozone,
        ozone_date: ozone_date,
        ozone_time: ozone_time
      });
    } catch (error) {
      console.error('error', error);
      res.status(500).send(error);
    }
  });

app.listen(port, ()=>{
    console.log(`Server running at port: ${port}`);
});