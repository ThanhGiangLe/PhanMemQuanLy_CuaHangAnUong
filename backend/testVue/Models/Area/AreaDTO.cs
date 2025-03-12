using Microsoft.EntityFrameworkCore.Metadata.Internal;
using System.ComponentModel.DataAnnotations;

namespace testVue.Models.Area
{
    public class AreaDTO
    {
        [Key]
        public int AreaId { get; set; } = default;
        public string AreaName { get; set; } = string.Empty;

        public ICollection<TableDTO>? Tables { get; set; }
    }
}