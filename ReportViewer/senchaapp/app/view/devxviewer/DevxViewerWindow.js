Ext.define('reportes.view.devxviewer.DevxViewerWindow', {
    extend: 'Ext.window.Window', 
    alias: 'widget.reportviewerwindow',
    requires:[
        'reportes.view.devxviewer.DevxViewer',
        'reportes.view.devxviewer.DevxViewerWindowController'
    ],
    controller:'reportviewerwindow',
    listeners:{
        beforedestroy:'onDestruir',
        afterrender:'onAfterRender',
        close:'onClose'
    },
    config:{
        host: undefined,
        reportUrl: undefined,
        invokeAction:undefined,
        //configs para controlar el toolbar del documentViewer
        searchActionVisible: false,
        multipageToggleActionVisible: false,
        printVisible:false,
        printPageVisible:false,
        exportToVisible:false,
        hightlightEditingFieldsVisible:false
    },
    initComponent: function(){
        var me = this;
        Ext.apply(me,{
            items:[
                {
                    xtype:'reportviewer',
                    host: me.getHost(),
                    reportUrl: me.getReportUrl(),
                    invokeAction:me.getInvokeAction(),
                    reference:'docviewer'
                }
            ]
        });
        me.callParent(arguments);
    },

    refreshReport:function(reporte){
        var me = this;
        var rep = me.down('reportviewer');
        rep.setReportUrl(reporte);
        rep.refreshReport();
    },

    enableSearch:function(){
        var me = this;
        var rep = me.down('reportviewer');
        rep.enableSearch();
    }

});