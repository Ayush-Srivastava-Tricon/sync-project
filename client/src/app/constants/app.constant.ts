import { Injectable } from "@angular/core";


@Injectable({
    providedIn: 'root'
})
export class AppConstants {


    public ota_api_url:any={
        open_gds: {
            url: 'https://api.opengds.com/core/v1',
            action_url: {
                GET_PROPERTY_LIST: {
                    url:'acc-rate/list',
                    params: {
                        theme_id: true,
                        apikey:true,
                      }
                },
                GET_ROOM_LIST: {
                    url:'acc-rate/list',
                    params: {
                        theme_id: true,
                        apikey:true,
                      }
                },
                GET_CALENDAR_DATA:{
                    url:'acc-status/calendar',
                    params:{
                        rate_id:true,
                        accom_id:true,
                        // from:true,
                        // till:true,
                        occupancy:true,
                        theme_id: true,
                        apikey:true,
                    }
                }
            },
            auth: {
                type: 'apikey',
                key: 'oyn0qruhvmxckh24untseew33yt4f37jbjy535t5',
            },
           
        },
        lazada: {
            url: 'https://api.opengds.com/core/v1',
            action_url: {
                GET_PROPERTY_LIST: 'property_list',
                GET_ROOM_LIST: 'room_list'
            },
            auth: {
                type: 'bearerToken',
                token: 'YOUR_LAZADA_BEARER_TOKEN'
            }
        },
    };


}