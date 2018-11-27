using System.Collections.Generic;
using System.IO;
using System.Drawing;
using System.Linq;
using DevExpress.XtraReports.UI;
using DevExpress.XtraReports.Web.Extensions;
using System.Collections;
using DXApplication1.Models;
using System;

namespace DXApplication1
{
    public class ReportStorageWebExtension : DevExpress.XtraReports.Web.Extensions.ReportStorageWebExtension
    {
        public Dictionary<string, XtraReport> Reports = new Dictionary<string, XtraReport>();


        public ReportStorageWebExtension()
        {
            Reports.Add("Products", new XtraReport1());
            Reports.Add("Empleados", new XtraReport2());
        }

        public override bool CanSetData(string url)
        {
            return true;
        }

        public override byte[] GetData(string url)
        {
            if (url == "runtime")
            {
                XtraReport3 reportr = new XtraReport3();
                reportr.DataSource = CreateData();
                reportr.FillDataSource();
                using (MemoryStream stream = new MemoryStream())
                {
                    reportr.SaveLayoutToXml(stream);
                    return stream.ToArray();
                }
            }
            if (!string.IsNullOrEmpty(url))
            {
                var report = Reports[url];
                using (MemoryStream stream = new MemoryStream())
                {
                    report.SaveLayoutToXml(stream);
                    return stream.ToArray();
                }
            }
            else
            {
                return null;
            }
        }

        public override Dictionary<string, string> GetUrls()
        {
            return Reports.ToDictionary(x => x.Key, y => y.Key);
        }

        public override void SetData(XtraReport report, string url)
        {
            if (Reports.ContainsKey(url))
            {
                Reports[url] = report;
            }
            else
            {
                Reports.Add(url, report);
            }
        }

        public override string SetNewData(XtraReport report, string defaultUrl)
        {
            SetData(report, defaultUrl);
            return defaultUrl;
        }

        public override bool IsValidUrl(string url)
        {
            return true;
        }

        public ArrayList obtenerDatos()
        {
            ArrayList listDataSource = new ArrayList();

            // Populate the list with records.
            listDataSource.Add(new Record(1, "Jane", 19));
            listDataSource.Add(new Record(2, "Joe", 30));
            listDataSource.Add(new Record(3, "Bill", 15));
            listDataSource.Add(new Record(4, "Michael", 42));

            return listDataSource;
        }

        private List<Data> CreateData()
        {
            List<Data> data = new List<Data>();

            Data item1 = new Data();
            item1.Date = DateTime.Now;
            item1.Id = 0;
            item1.Name = "First";
            data.Add(item1);

            Data item2 = new Data();
            item2.Date = DateTime.Now;
            item2.Id = 1;
            item2.Name = "Second";
            data.Add(item2);

            Data item3 = new Data();
            item3.Date = DateTime.Now;
            item3.Id = 2;
            item3.Name = "Third";
            data.Add(item3);

            return data;
        }
    }
}
