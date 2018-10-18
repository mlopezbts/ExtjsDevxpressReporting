Ext.define('reportes.view.devxviewer.DevxViewer', {
    extend: 'Ext.container.Container',
    alias: 'widget.reportviewer', // this component will have an xtype of 'managedimage'

    autoEl: {
        'data-bind': 'dxReportViewer: viewerOptions'
    },
    config: {
        host: undefined,
        invokeAction: undefined,
        //configs para controlar el toolbar del documentViewer
        searchActionVisible: false,
        multipageToggleActionVisible: false,
        printVisible: false,
        printPageVisible: false,
        exportToVisible: false,
        hightlightEditingFieldsVisible: false,
        reportUrl: undefined
    },
    reportUrlObsv: undefined,
    searchEnabledObsv:undefined,
    viewerOptions: {},

    //DocumentViewerToolbar, objeto con metodos para controlar el toolbar
    docViewerToolbar: undefined,
    toolbarActions: {
        Design: undefined,
        ExportTo: undefined,
        FirstPage: undefined,
        HightlightEditingFields: undefined,
        LastPage: undefined,
        MultipageToggle: undefined,
        NextPage: undefined,
        Pagination: undefined,
        PrevPage: undefined,
        Print: undefined,
        PrintPage: undefined,
        Search: undefined,
        ZoomIn: undefined,
        ZoomOut: undefined,
        ZoomSelector: undefined
    },

    onRender: function () {
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
        this.el.on('load', this.onLoad, this);
        this.reportUrlObsv = ko.observable(this.getReportUrl());
        this.searchEnabledObsv = ko.observable(true);
    },

    onLoad: function () {
        this.fireEvent('load', this);
    },

    afterRender: function () {
        var me = this;
        me.callParent(arguments);
        me.bindReport();
    },

    bindReport: function () {
        var me = this;
        me.viewerOptions = {
            reportUrl: me.reportUrlObsv, // The URL of a report that is opened in the Document Viewer when the application starts.
            requestOptions: { // Options for processing requests from the Web Document Viewer.
                host: me.getHost(), // URI of your backend project.
                invokeAction: me.getInvokeAction() // The URI path of the controller action that processes requests. 
            },
            callbacks: {
                CustomizeMenuActions: function (s, e) {
                    console.log('CustomizeMenuActions');
                    me.docViewerToolbar = e;
                    me.searchAction =  me.docViewerToolbar.GetById(DevExpress.Report.Preview.ActionId.Search);
                    me.searchAction.disabled = me.searchEnabledObsv;
                },
                DocumentReady: function (s, e) {
                    console.log('document ready');
                    console.log(s);
                    console.log(e);
                }
            }
        };

        ko.applyBindings({ viewerOptions: me.viewerOptions });
    },

    obtenerBotonesToolbar: function (toolbar){
        var me = this;
        Ext.Object.each(DevExpress.Report.Preview.ActionId,function(key, value, actions){
            me.toolbarActions[key] = toolbar.GetById(value);
        });
        console.log(me.toolbarActions);
    },

    refreshReport: function () {
        var me = this;
        me.reportUrlObsv(me.getReportUrl());
        me.searchEnabledObsv(false);
    },

    enableSearch:function(){
        var me = this;
        me.searchEnabledObsv(false);
    }
});