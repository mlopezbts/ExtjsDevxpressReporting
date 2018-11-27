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
    viewerOptions: {},

    //DocumentViewerToolbar, objeto con metodos para controlar el toolbar
    docViewerToolbar: undefined,
    toolbarActions: {
        Design: DevExpress.Report.Preview.ActionId.Design,
        ExportTo: DevExpress.Report.Preview.ActionId.ExportTo,
        FirstPage: DevExpress.Report.Preview.ActionId.FirstPage,
        HightlightEditingFields: DevExpress.Report.Preview.ActionId.FirstPage,
        LastPage:  DevExpress.Report.Preview.ActionId.LastPage,
        MultipageToggle: DevExpress.Report.Preview.ActionId.MultipageToggle,
        NextPage: DevExpress.Report.Preview.ActionId.NextPage,
        Pagination: DevExpress.Report.Preview.ActionId.Pagination,
        PrevPage: DevExpress.Report.Preview.ActionId.PrevPage,
        Print: DevExpress.Report.Preview.ActionId.Print,
        PrintPage: DevExpress.Report.Preview.ActionId.PrintPage,
        Search: DevExpress.Report.Preview.ActionId.Search,
        ZoomIn: DevExpress.Report.Preview.ActionId.ZoomIn,
        ZoomOut: DevExpress.Report.Preview.ActionId.ZoomOut,
        ZoomSelector:  DevExpress.Report.Preview.ActionId.ZoomSelector
    },

    onRender: function () {
        this.autoEl = Ext.apply({}, this.initialConfig, this.autoEl);
        this.callParent(arguments);
        this.el.on('load', this.onLoad, this);
        this.reportUrlObsv = ko.observable(this.getReportUrl());
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
                    me.docViewerToolbar.Actions.forEach(function(item){ item.visible = ko.isWriteableObservable(item.visible) ? item.visible : ko.observable(true) });
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
    },

    enableSearch:function(){
        var me = this;
    }
});