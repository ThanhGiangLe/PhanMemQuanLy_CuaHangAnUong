using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using testVue.Datas;
using testVue.Models.Inventory;
using testVue.Models.Inventory.Inventory;

namespace testVue.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class InventoryController : ControllerBase
    {
        private readonly AppDbContext _appDbContext;
        public InventoryController(AppDbContext appDbContext)
        {
            _appDbContext = appDbContext;
        }

        [HttpGet("get-all-material")]
        public async Task<ActionResult<IEnumerable<MaterialDTO>>> GetAllMaterial()
        {
            return await _appDbContext.Materials.ToListAsync();
        }

        [HttpPost("update-quantity-material")]
        public async Task<IActionResult> UpdateQuantityMaterial([FromBody] UpdateQuantityMaterialDTO request)
        {
            if (request == null || request.AddedQuantity < 0) {
                return BadRequest("Dữ liệu không hợp lệ.");
            }
            var material = await _appDbContext.Materials.FindAsync(request.MaterialId);
            if(material == null)
            {
                return NotFound("Không tìm thấy nguyên liệu.");
            }

            var now = DateTime.Now;
            if(material.MaterialType.ToLower().Equals("thực phẩm"))
            {
                material.ImportDate = now;
                material.ExpirationDate = now.AddDays(4);
            }else if(material.MaterialType.ToLower().Equals("nguyên liệu"))
            {
                material.ImportDate = now;
                material.ExpirationDate = now.AddDays(15);
            }
            else if(material.MaterialType.ToLower().Equals("gia vị")) {
                material.ImportDate = now;
                material.ExpirationDate = now.AddDays(30);
            }

            material.Quantity += request.AddedQuantity;

            // Cập nhật vào database
            _appDbContext.Materials.Update(material);
            await _appDbContext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Cập nhật số lượng thành công!",
                UpdatedQuantity = material.Quantity,
                ImportDateRes = material.ImportDate,
                ExpirationDateRes = material.ExpirationDate,
            });
        }

        [HttpPost("cancel-all-goods")]
        public async Task<IActionResult> CancelAllGoods([FromBody] CancelAllGoodsDTO request)
        {
            if (request.MaterialId == 0)
            {
                return BadRequest("Dữ liệu không hợp lệ");
            }
            var material = await _appDbContext.Materials.FindAsync(request.MaterialId);
            if(material == null)
            {
                return NotFound("Không tìm thấy nguyên liệu.");
            }
            material.Quantity = 0;
            var now = DateTime.Now;
            material.ImportDate = now;
            material.ExpirationDate = now;

            _appDbContext.Materials.Update(material);
            await _appDbContext.SaveChangesAsync();

            return Ok(new
            {
                Message = "Hủy bỏ nguyên liệu thành công",
                Id = material.MaterialId,
                UpdateQuantity = material.Quantity,
                ImportDateRes = material.ImportDate,
                ExpirationDateRes = material.ExpirationDate,
            });
        }
    }
}
