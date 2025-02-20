namespace testVue.Models
{
    public class Inventory
    {
        public int InventoryId { get; set; }
        public string ItemName { get; set; }
        public int Quantity { get; set; }
        public int MinQuantity { get; set; }
        public string Unit { get; set; }
        public string ItemType { get; set; } // e.g., "Raw Material", "Packaged Goods"

        public ICollection<InventoryLog> InventoryLogs { get; set; }
    }
}