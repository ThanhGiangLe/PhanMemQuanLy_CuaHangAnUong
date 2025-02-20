using Microsoft.EntityFrameworkCore.Metadata.Internal;

namespace testVue.Models
{
    public class Area
    {
        public int AreaId { get; set; }
        public string AreaName { get; set; }

        public ICollection<Table> Tables { get; set; }
    }
}