"use strict";

const invokeAction = "/WebDocumentViewer/Invoke",
      host = "http://localhost/DXApplication1/",
    reportUrl = ko.observable("Empleados"),
    viewerOptions = {
        reportUrl: reportUrl, // The URL of a report that is opened in the Document Viewer when the application starts.
        requestOptions: { // Options for processing requests from the Web Document Viewer.
            host: host, // URI of your backend project.
            invokeAction: invokeAction // The URI path of the controller action that processes requests. 
        }
    };

ko.applyBindings({ viewerOptions });