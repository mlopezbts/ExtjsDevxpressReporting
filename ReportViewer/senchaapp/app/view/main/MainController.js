/**
 * This class is the controller for the main view for the application. It is specified as
 * the "controller" of the Main view class.
 *
 * TODO - Replace this content of this view to suite the needs of your application.
 */
Ext.define('reportes.view.main.MainController', {
    extend: 'Ext.app.ViewController',

    alias: 'controller.main',

    onItemSelected: function (sender, record) {
        Ext.Msg.confirm('Confirm', 'Are you sure?', 'onConfirm', this);
    },

    onConfirm: function (choice) {
        if (choice === 'yes') {
            //
        }
    },
    onReportButtonClick:function(button){
        var me=this,
            docViewer = me.lookupReference('viewercontainer');
        
        docViewer.refreshReport(button.text);
    },

    onSearchEnable:function(){
        var me=this,
            docViewer = me.lookupReference('viewercontainer');
        
        docViewer.enableSearch();
    },

    onReportWindowClick(button){
        var me = this;
        var viewer = Ext.ComponentQuery.query('reportviewerwindow')[0];
        if(viewer){
            viewer.show();
            viewer.refreshReport(button.text);
        }
        else{
            viewer = Ext.create('reportes.view.devxviewer.DevxViewerWindow',{
                host: "http://localhost/DXApplication1/",
                reportUrl: "",
                invokeAction:"/WebDocumentViewer/Invoke",
                layout:'fit',
                height:800,
                width:1000,
                padding:10,
                modal:true,
                shim:true,
                closeAction:'hide'
            });
            viewer.show();
        }
        
        
    }
});
