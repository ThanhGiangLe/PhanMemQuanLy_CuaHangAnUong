using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace testVue.Models
{
    [Table("AdditionalFood")]
    public class AdditionalFood
    {
        public int Id { get; set; }

        public string FoodName { get; set; }

        public string Description { get; set; }

        public string Unit { get; set; }

        public decimal Price { get; set; }

        public int? CategoryId { get; set; }

        public int Quantity { get; set; }

    }
}