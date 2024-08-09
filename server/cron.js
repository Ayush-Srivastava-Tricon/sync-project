// const cron  = require('node-cron');
const connection = require("./config/db.js");
const  otaConfig = require("./routes/otaConstant.js");
const { default: axios } = require('axios');

async function callApi() {
    const queryStr = `SELECT ota.site_name, ota.id AS ota_id, ota.site_apiKey AS apikey, ota.site_endpoint, rooms.room_id AS accom_id, rooms.rate_id,rooms.name AS room_name,rooms.number_of_persons AS occupancy, properties.property_id FROM ota JOIN rooms ON ota.id = rooms.ota_id JOIN properties ON ota.id = properties.ota_id`;

        const otaList = await new Promise((resolve,reject)=>{
             connection.query(queryStr,(err,result)=>{
                if(!err){
                    resolve(result);
                }
             });
        });

        const calendarUrl = 'http://localhost:3000/api/import_calendar_data_and_save';   //for localhost

        if(otaList.length> 0){
            otaList.forEach(async (e)=>{
                let formatSiteName = e.site_name.toLowerCase().split(" ").join('_');
                let actionUrl =  otaConfig[formatSiteName]['action_url']['GET_CALENDAR_DATA']['url'];
                let queryParamsForApi = otaConfig[formatSiteName]['action_url']['GET_CALENDAR_DATA']['params'];
                let fullUrl = `${e.site_endpoint}/${actionUrl}`;

                if (queryParamsForApi) {
                    Object.keys(queryParamsForApi).forEach(key => {
                        if (queryParamsForApi[key]) {
                            fullUrl += `${fullUrl.includes('?') ? '&' : '?'}${key}=${e[key]}`;
                        }
                    });
                }

                let  params = {
                    site_details:{
                        site_name:e.site_name,
                        ota_id:e.ota_id,
                        property_id:e.property_id,
                        room_id:e.accom_id,
                        rate_id:e.rate_id,
                        room_name:e.room_name,
                    },
                    apiUrl:fullUrl,
                    authType:queryParamsForApi ? '' : 'bearer'
                }

               const result =  await axios.post(calendarUrl, params)
                .then((response) => response)
                .catch((error) => console.error(error));

                
                console.log(result.data);
            });

        }


    //   return result;

  }

  module.exports = callApi;

