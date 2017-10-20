//Engine Connections will always require Certificate SSL for connectivity
//runSecureHTTPS and QlikConfig.secure should be kept in step

var config = {  'State' : 'External',
                'EngineConnectPort': 1000,
                'EngineConnectHost': 'server-name',
                'WebPortalPort': 3000,
                'runSecureHTTPS': false,
                'certificateDir': 'C:\\qlik\\OpenDataPortal\\certificates',
                'Profile': {
                    'UserDirectory': 'NotARealDirectory', 
                    'UserId': 'OpenDataPortalUser',
                    'Attributes': []
                },
                'QlikConfig':{  
                    'host': 'server-name',  
                    'prefix': '/ticket/',  
                    'port': 4747,  
                    'secure': false,
                    'rejectUnauthorized': false
                },
                'EngineUserProfile':{
                        'UserDirectory':'NotARealDirectory',
                        'UserId':'OpenDataPortalUser'
                }
            }

module.exports =  config;