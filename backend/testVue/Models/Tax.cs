namespace testVue.Models
{
    public class Tax
    {
        public int TaxId { get; set; }
        public string TaxName { get; set; }
        public decimal TaxValue { get; set; }
        public bool Status { get; set; } // true for enabled, false for disabled
    }
}