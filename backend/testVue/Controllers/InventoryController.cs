using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using testVue.Datas;
using testVue.Models;

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
        public async Task<ActionResult<IEnumerable<Material>>> GetAllMaterial()
        {
            return await _appDbContext.Materials.ToListAsync();
        }
    }
}
