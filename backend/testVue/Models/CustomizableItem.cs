using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace testVue.Models
{
    [Table("CustomizableItem")]
    public class CustomizableItem
    {
        [Key]
        public int CustomItemId { get; set; }

        [Required]
        public string CustomItemName { get; set; }

        [Required]
        public decimal CustomItemPrice { get; set; }
    }
}