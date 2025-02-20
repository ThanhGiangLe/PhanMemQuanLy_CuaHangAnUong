namespace testVue.Models
{
    public class OrderDetailShowViewReport
    {
        public string FullName { get; set; }
        public DateTime OrderTime { get; set; }
        public string TableName { get; set; }
        public decimal TotalAmount { get; set; }
        public decimal Discount { get; set; }
        public decimal Tax { get; set; }
    }
}
