using CampusGigWebApi.Data;
using CampusGigWebApi.DTOs.Gigs;
using CampusGigWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Security.Claims;

namespace CampusGigWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class GigsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public GigsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetAll()
        {
            var gigs = await _context.Gigs
                .Include(g => g.Poster)
                .AsNoTracking()
                .ToListAsync();

            return Ok(gigs);
        }

        [Authorize]
        [HttpPost]
        public async Task<IActionResult> Create(CreateGigDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var profile = await _context.Profiles.FindAsync(userId);

            if (profile == null)
                return NotFound("Profile not found");

            if (profile.WalletBalance < dto.RewardCredits)
            {
                return BadRequest("Insufficient wallet balance");
            }

            var gig = new Gig
            {
                GigId = Guid.NewGuid(),
                PosterId = userId,
                Title = dto.Title,
                Description = dto.Description,
                Category = Enum.Parse<GigCategory>(dto.Category),
                RewardCredits = dto.RewardCredits,
                Deadline = dto.Deadline,
                Status = GigStatus.Open,
                CreatedAt = DateTime.UtcNow
            };

            _context.Gigs.Add(gig);

            await _context.SaveChangesAsync();

            return Ok(gig);
        }

        [Authorize]
        [HttpPatch("{id}/complete")]
        public async Task<IActionResult> MarkComplete(Guid id)
        {
            var gig = await _context.Gigs.FindAsync(id);

            if (gig == null)
                return NotFound();

            gig.Status = GigStatus.Completed;

            await _context.SaveChangesAsync();

            return Ok("Gig marked completed");
        }

        [Authorize(Roles = "Manager")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> Delete(Guid id)
        {
            var gig = await _context.Gigs.FindAsync(id);

            if (gig == null)
                return NotFound();

            _context.Gigs.Remove(gig);

            await _context.SaveChangesAsync();

            return Ok("Gig deleted");
        }
    }
}