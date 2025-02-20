using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace testVue.Models
{
    [Table("FoodItem")]
    public class FoodItem
    {
        [Key]
        public int FoodItemId { get; set; }

        [Required]
        public string FoodName { get; set; }

        [Required]
        public decimal PriceListed { get; set; }

        public decimal? PriceCustom { get; set; }

        public string ImageUrl { get; set; }

        public string Unit { get; set; } = "phần";

        public int? CategoryId { get; set; }

        public DateTime? CreateDate {  get; set; }

        public DateTime? UpdateDate { get; set; }

        [Required]
        public string Status { get; set; } = "available";
    }
}