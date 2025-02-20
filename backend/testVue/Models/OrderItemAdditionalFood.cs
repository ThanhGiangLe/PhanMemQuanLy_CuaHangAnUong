namespace testVue.Models
{
    public class OrderItemAdditionalFood
    {
        public int OrderItemAdditionalFoodId { get; set; }
        public int OrderItemId { get; set; }  // Liên kết với OrderItem
        public int AdditionalFoodId { get; set; }  // Liên kết với món ăn bổ sung (FoodItem)
        public decimal Price { get; set; }  // Giá món ăn bổ sung
        public string Unit { get; set; }
        public OrderItem OrderItem { get; set; }  // Mối quan hệ với OrderItem
        public AdditionalFood AdditionalFood { get; set; }  // Mối quan hệ với món ăn bổ sung
    }
}
