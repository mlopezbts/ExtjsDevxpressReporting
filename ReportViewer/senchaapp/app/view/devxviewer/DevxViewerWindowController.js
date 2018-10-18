Ext.define('reportes.view.devxviewer.DevxViewerWindowController', {
    extend: 'Ext.app.ViewController',
    alias: 'controller.reportviewerwindow',

    onDestruir:function(comp){
        console.log('cleannode');
    },

    onAfterRender:function(){
        console.log('after');
    },
    
    onClose:function(){
        var me = this;
        var vista = me.getView();
        vista.refreshReport('');
    }
});