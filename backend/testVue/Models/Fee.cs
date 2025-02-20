namespace testVue.Models
{
    public class Fee
    {
        public int FeeId { get; set; }
        public string FeeName { get; set; }
        public decimal FeeValue { get; set; }
        public ICollection<FoodItem> AppliedItems { get; set; }
    }
}