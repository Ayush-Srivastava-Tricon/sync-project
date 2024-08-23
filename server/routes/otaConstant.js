const otaConfig ={
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
                    occupancy:true,
                    apikey:true,
                }
            },
            CREATE_RESERVATION_BOOKING:{
                url:'acc-reservation/create',
                params:{
                    apikey:true
                }
            },
            CANCEL_BOOKING:{
                url:'acc-reservation/cancel',
                params:{
                    apikey:true
                }
            },
            
        },
        auth: {
            type: 'apikey',
            apikey: 'oyn0qruhvmxckh24untseew33yt4f37jbjy535t5',
        },
       
    },
};

module.exports = otaConfig;