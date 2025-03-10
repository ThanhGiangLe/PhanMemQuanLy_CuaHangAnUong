using testVue.Models.Food;

namespace testVue.Models
{
    public class Discount
    {
        public int DiscountId { get; set; }
        public string DiscountName { get; set; }
        public decimal DiscountValue { get; set; }
        public ICollection<FoodItemDTO>? AppliedItems { get; set; }
    }
}