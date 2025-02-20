using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace testVue.Models
{
    public class Material
    {
        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int MaterialId { get; set; } // Mã nguyên liệu (auto-generated ID)

        [Required]
        [MaxLength(100)]
        public string MaterialName { get; set; } // Tên nguyên liệu

        [MaxLength(50)]
        public string MaterialType { get; set; } // Loại nguyên liệu

        [Required]
        [Range(0, double.MaxValue)]
        public double Quantity { get; set; } // Lượng (Số lượng hiện tại)

        [Required]
        [Range(0, double.MaxValue)]
        public double MinQuantity { get; set; } // Số lượng tối thiểu

        [Required]
        [MaxLength(20)]
        public string Unit { get; set; } // Đơn vị tính

        [Required]
        public DateTime ImportDate { get; set; } // Ngày nhập

        public DateTime? ExpirationDate { get; set; } // Ngày hết hạn (nullable)

        [Required]
        [Column(TypeName = "decimal(18,2)")]
        public decimal ImportPrice { get; set; } // Giá nhập

    }
}
