namespace testVue.Models
{
    public class OrderItem
    {
        public int OrderItemId { get; set; }
        public int OrderId { get; set; }
        public int FoodItemId { get; set; }
        public int Quantity { get; set; }
        public decimal Price { get; set; }
        //public int? CustomItemId { get; set; }

        //public Order Order { get; set; }
        //public FoodItem FoodItem { get; set; }
        //public CustomizableItem CustomItem { get; set; }
        public string? FoodName { get; internal set; }
        public int IsMainItem { get; internal set; }
        public string Unit { get; internal set; }
        public string Note { get; internal set; }
        public int CategoryId { get; set; }

        public DateTime OrderTime { get; set; }

    }

}