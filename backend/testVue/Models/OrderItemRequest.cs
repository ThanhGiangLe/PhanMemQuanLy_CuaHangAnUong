namespace testVue.Models
{
    public class OrderItemRequest
    {
        public int OrderId { get; set; }
        public int FoodItemId { get; set; }
        public string? FoodName { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        public int IsMainItem { get; set; }
        public string Unit { get;  set; }
        public string Note { get;  set; }
        public int CategoryId { get; set; }
        public DateTime OrderTime { get; set; }


    }
}
