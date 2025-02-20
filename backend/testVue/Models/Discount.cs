namespace testVue.Models
{
    public class Discount
    {
        public int DiscountId { get; set; }
        public string DiscountName { get; set; }
        public decimal DiscountValue { get; set; }
        public ICollection<FoodItem> AppliedItems { get; set; }
    }
}