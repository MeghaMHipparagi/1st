using CampusGigWebApi.Data;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace CampusGigWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AnalyticsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public AnalyticsController(AppDbContext context)
        {
            _context = context;
        }

        [Authorize(Roles = "Manager")]
        [HttpGet("summary")]
        public async Task<IActionResult> GetSummary()
        {
            var analytics = await _context.Gigs
                .GroupBy(g => g.Status)
                .Select(g => new
                {
                    Status = g.Key.ToString(),
                    Count = g.Count(),
                    TotalCredits = g.Sum(x => x.RewardCredits)
                })
                .ToListAsync();

            return Ok(analytics);
        }
    }
}