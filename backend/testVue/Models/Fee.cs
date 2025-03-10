using testVue.Models.Food;

namespace testVue.Models
{
    public class Fee
    {
        public int FeeId { get; set; }
        public string FeeName { get; set; }
        public decimal FeeValue { get; set; }
        public ICollection<FoodItemDTO>? AppliedItems { get; set; }
    }
}