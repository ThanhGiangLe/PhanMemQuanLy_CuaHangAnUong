    using Microsoft.EntityFrameworkCore.Metadata.Internal;

    namespace testVue.Models
    {
        public class Order
        {
            public int OrderId { get; set; }
            public int UserId { get; set; }
            public DateTime OrderTime { get; set; }
            public int TableId { get; set; }
            public decimal TotalAmount { get; set; }
            public string Status { get; set; } // e.g., "Paid", "Unpaid"
            public decimal? Discount { get; set; }
            public decimal? Tax { get; set; }

            //public User User { get; set; }
            //public Table Table { get; set; }
            //public ICollection<OrderItem> OrderItems { get; set; }
        }
    }
