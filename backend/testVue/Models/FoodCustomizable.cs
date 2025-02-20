using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace testVue.Models
{
    [Table("FoodCustomizable")]
    public class FoodCustomizable
    {
        [Key]
        public int FoodCustomId { get; set; }

        public int FoodItemId { get; set; }

        public int CustomItemId { get; set; }
    }
}