namespace testVue.Models
{
    public class AddOrderRequest
    {
        public int UserId { get; set; }
        public DateTime OrderTime { get; set; }
        public int TableId { get; set; }
        public decimal TotalAmount { get; set; }
        public string Status { get; set; } // e.g., "Paid", "Unpaid"
        public decimal? Discount { get; set; }
        public decimal? Tax { get; set; }
        //public List<OrderItemRequest> Items { get; set; }
    }
}
