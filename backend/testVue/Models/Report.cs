namespace testVue.Models
{
    public class Report
    {
        public int ReportId { get; set; }
        public string ReportType { get; set; } // e.g., "Revenue", "Popular Items", "Inventory"
        public DateTime CreatedAt { get; set; }
        public string ReportData { get; set; } // JSON or reference to other tables
    }
}