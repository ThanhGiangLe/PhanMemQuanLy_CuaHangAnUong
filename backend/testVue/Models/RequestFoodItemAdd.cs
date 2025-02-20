using System.ComponentModel.DataAnnotations;

namespace testVue.Models
{
    public class RequestFoodItemAdd
    {

        public string FoodName { get; set; }

        public decimal PriceListed { get; set; }

        public decimal? PriceCustom { get; set; }

        public string Unit { get; set; } = "phần";

        public int? CategoryId { get; set; }

        public string ImageUrl { get; set; }

    }
}
