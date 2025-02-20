namespace testVue.Models
{
    public class InventoryLog
    {
        public int InventoryLogId { get; set; }
        public int InventoryId { get; set; }
        public int QuantityAdded { get; set; }
        public DateTime LogTime { get; set; }
        public int UserId { get; set; }

        public Inventory Inventory { get; set; }
        public User User { get; set; }
    }
}