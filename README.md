# OpenDataPortal

This is an approach that I worked on for a potential customer that allows for Qlik App's to be surfaced as Datasets, for the express purpose of identifying and extracting relevant information easily.

This solution uses a combination of the Capabilities API and the Engine API (via qSocks) to be able to easily provide the end user with a logical workflow for data extraction.

## Human Prerequisites

* Basic understanding of Node.JS, for troubleshooting
* Basic understanding of Qlik Sense API's
* Proficient in the use of the Qlik Management Console
* Basic understanding of Qlik Ticket Authentication

## Machine Prerequisites

* Node.JS
* Favourite Text Editor
* Qlik Admin Rights (To assign user Permissions and manipulate Proxy settings)


## Getting Started

1. Clone Rep to C:\OpenDataPortal
1. Export Certificates
    * Specify the hostname that will be used to access the server, must be the same hostname that the end users will access the WebPortal with as well.
    * Do not specify a password
    * Export both the PEM Format and the Windows format
1. Copy certificate files too a location that the user running this application can access without elevated privileges i.e. 
    > C:\OpenDataPortal\Certificates
1. Ensure hostname is entered in the White List for the virtual proxy
    * I'll often create a dedicated virtual proxy just for the OpenDataPortal to ensure I can manipulate settings as necessary, without impacting my primary users. This virtual proxy is not easily visible to end users.
    * If creating a Virtual Proxy, don't forget to link it to the Proxy (I always forget this part)
1. Create the header record on the virtual proxy to allow Cross Origin access to script files e.g:
    > Access-Control-Allow-Origin:*
    * Note that this is a wildcard entry example, and should not be used for public facing production environments.
1. Update Config.js (Refer too [Config.JS Explained](#config.js-explained))
1. If not using HTTPS, ensure that your proxy has HTTP access enabled
1. Initialise Node Dependencies
    1. Open Powershell
    1. Navigate to the EngineConnect Directory  
    ```cd C:\OpenDataPortal\EngineConnect```
    1. Execute package deployment  
    ```npm install```
    1. Navigate to the WebPortal Directory  
    ```cd C:\OpenDataPortal\WebPortal```
    1. Execute package deployment  
    ```npm install```
1. Navigate to the OpenDataPortal Directory  
```cd C:\OpenDataPortal```
1. Execute the Engine Connect  
```node .\EngineConnect\app.js```
1. Execute the WebPortal  
```node .\WebPortal\app.js```
1. Try to browse available datasets 
1. Allocate user permissions for the User Specified in Config.js
1. Successfully Browse available datasets
1. Fork, Expand and Improve this repository

![image](https://user-images.githubusercontent.com/18130038/31975639-2545ab1c-b98f-11e7-9a31-16596e6b420c.png)

## Config.JS Explained
This file creates a JS object called config that is utilised throughout the code base. You can amend the properties of this object to alter these options for the implementation.

### State
This is a non-utilised field, please ignore.
>  External
### EngineConnectPort
This is the port that will host the intermediary API's that allow the Web Portal to interact with Qlik Sense
> 1000
### EngineConnectHost
This is the host name of the Qlik Sense Engine Node to connect too
> server-name
### WebPortalPort
This is the port that will host the WebPortal content for end users to access
> 3000
### runSecureHTTPS
This is a setting that will allow the Web Portal to be hosted using the specified certificates, and served via HTTPS.  
*It should be noted that if this is set to True, then QlikConfig.secure will also need to be True.*
> false
### certificateDir
This is the directory where the Qlik Certificates can be accessed by the user account executing the node applications.
> C:\\OpenDataPortal\\certificates
### Profile.UserDirectory
The name of the User Directory to be utilised by the account that will be used to build visualisations
> NotARealDirectory
### Profile.UserId
The name of the User to be utilised by the account that will be used to build visualisations
> OpenDataPortalUser
### Profile.Attributes
Any User Attributed to be utiilised by the account that will be used to build visualisations
> []
### QlikConfig.host
The name of the server that hosts the Qlik Sense Proxy
> server-name
### QlikConfig.prefix
The name of the Virtual Proxy to be utilised. Note that **the preceeding and trailing forward-slash is important.**
> /ticket/  
### QlikConfig.port
The port to connect to the Qlik Sense Engine service
> 4747
### QlikConfig.secure
Specify whether or not communications with the Qlik server should be done using TLS/SSL encryption.  
*It should be noted that this must be set to True if runSecureHTTPS is also  True.*
> false
### QlikConfig.rejectUnauthorized
When connecting to Qlik Services should unauthorised certificates be rejected to secure communications.
> false
### EngineUserProfile.UserDirectory
The name of the User Directory to be utilised by the account that will be used to connect to the Engine Service
> NotARealDirectory
### EngineUserProfile.UserId
The name of the User to be utilised by the account that will be used to connect to the Engine Service
> OpenDataPortalUser

## Room for Improvement
* Tidy up of the Certificates, only require one format
* Tidy up the config file to avoid duplicate and erroneous settings
* Support certificate passwords
* Upgrade to later version of Enigma.JS (Currently using version 1.0.1)

## Authors

* **Daniel McInteer** - *Initial work* - [WgtnDan](https://github.com/WgtnDan)

See also the list of [contributors](https://github.com/wgtndan/opendataportal/contributors) who participated in this project.

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details
