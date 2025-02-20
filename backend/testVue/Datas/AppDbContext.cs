using Microsoft.EntityFrameworkCore;
using testVue.Models;

namespace testVue.Datas
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) { }

        public DbSet<User> Users { get; set; } 
        public DbSet<FoodItem> FoodItems { get; set; }
        public DbSet<FoodCategory> FoodCategories { get; set; }
        public DbSet<FoodPriceType> FoodPriceTypes { get; set; }
        public DbSet<CustomizableItem> CustomizableItems { get; set; }
        public DbSet<FoodCustomizable> FoodCustomizables { get; set; }
        public DbSet<AdditionalFood> AdditionalFoods { get; set; }
        public DbSet<Table> Tables { get; set; }
        public DbSet<Order> Orders { get; set; }
        public DbSet<OrderItem> OrderItems { get; set; }
        public DbSet<Material> Materials { get; set; }

    }
}
