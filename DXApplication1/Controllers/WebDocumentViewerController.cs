using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using DevExpress.Web.Mvc.Controllers;
using DevExpress.XtraReports.Web;

namespace DXApplication1.Controllers
{
    public class WebDocumentViewerController : WebDocumentViewerApiController
    {
        // GET: WebDocumentViewer
        public override ActionResult Invoke()
        {
            var result = base.Invoke();
            Response.AppendHeader("Access-Control-Allow-Origin", "*");
            return result;
        }
    }
}