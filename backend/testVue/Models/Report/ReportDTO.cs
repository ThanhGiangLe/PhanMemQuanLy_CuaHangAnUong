using System.ComponentModel.DataAnnotations;

namespace testVue.Models.Report
{
    public class ReportDTO
    {
        [Key]
        public int ReportId { get; set; } = default;
        public string ReportType { get; set; } = string.Empty; // e.g., "Revenue", "Popular Items", "Inventory"
        public DateTime? CreatedAt { get; set; }
        public string ReportData { get; set; } = string.Empty; // JSON or reference to other tables
    }
}