namespace testVue.Models
{
    public class CashRegister
    {
        public int CashRegisterId { get; set; }
        public int UserId { get; set; }
        public DateTime StartTime { get; set; }
        public DateTime? EndTime { get; set; }
        public decimal StartBalance { get; set; }
        public decimal? EndBalance { get; set; }
        public decimal TotalIncome { get; set; }
        public decimal TotalExpenses { get; set; }

        public User User { get; set; }
    }
}