using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace testVue.Models
{
    [Table("FoodPriceType")]
    public class FoodPriceType
    {
        [Key]
        public int PriceTypeId { get; set; }

        public int FoodItemId { get; set; }

        public string Size { get; set; }

        [Required]
        public decimal Price { get; set; }
    }
}