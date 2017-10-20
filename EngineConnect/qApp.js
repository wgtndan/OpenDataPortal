var qGlobal = require('./qGlobal');

class qApp {
    constructor(){
        this.appGuid = null;
        this.app = null;
        this.appLayout = null;
        this.title = null;
        this.info = null;
        this.config=null;
    }

    getApp(appGuid){
            return qGlobal.then((g)=>{
                this.config = g.session.rpc.sessionConfig;
                return g.openApp(appGuid).then( (app) => {
                    this.app = app;
                    return app;
                });
            });
    }
    getAppLayout(appGuid){
        return this.getApp(appGuid).then((app)=> {
             return app.getAppLayout().then((appLayout) =>{
                        this.appLayout = appLayout;
                        return appLayout;
                    });
        })
    }
    getTitle(appGuid){
        return this.getAppLayout(appGuid).then((appLayout) =>{
            this.title = appLayout.qTitle;
            return appLayout.qTitle;
        });
    }
    getAppInfo(appGuid){
        return this.getApp(appGuid).then((app) =>{
            return app.getAllInfos().then((allInfos) =>{
                this.info = allInfos;
                return allInfos; 
            });
        });
    }
    getAppDimensions(appGuid, properties){
        return this.getApp(appGuid).then((app) =>{
            return app.createSessionObject(properties).then( ( list ) => {
                return list.getLayout().then((layout) =>{
                    return layout.qDimensionList.qItems;
                });
            });
        });
    }
    getAppMeasures(appGuid, properties){
        return this.getApp(appGuid).then((app) =>{
            return app.createSessionObject(properties).then( ( list ) => {
                return list.getLayout().then((layout) =>{
                    return layout.qMeasureList.qItems;
                });
            });
        });
    }
    getCsvUrl(appGuid, properties){
        return this.getApp(appGuid).then((app) =>{
            return app.createSessionObject(properties).then((cube) => {
                return cube.exportData("CSV_C", "/qHyperCubeDef", "testExport.csv").then((response) => {
                    var baseUrl = ( this.config.secure ? "https://" : "http://" ) + this.config.host + this.config.prefix;
                     console.log(baseUrl + response.qUrl);
                    return(baseUrl + response.qUrl.substring(1));
                });
            });
        });
    }
}
module.exports = qApp;