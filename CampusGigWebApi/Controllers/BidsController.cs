using CampusGigWebApi.Data;
using CampusGigWebApi.DTOs.Bids;
using CampusGigWebApi.Models;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System.Net.NetworkInformation;
using System.Security.Claims;
using System.Security.Cryptography;

namespace CampusGigWebApi.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class BidsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public BidsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<IActionResult> CreateBid(CreateBidDto dto)
        {
            var userId = Guid.Parse(User.FindFirstValue(ClaimTypes.NameIdentifier));

            var gig = await _context.Gigs.FindAsync(dto.GigId);

            if (gig == null)
                return NotFound("Gig not found");

            if (gig.PosterId == userId)
                return BadRequest("You cannot bid on your own gig");

            var existingBid = await _context.Bids
                .FirstOrDefaultAsync(b => b.GigId == dto.GigId && b.BidderId == userId);

            if (existingBid != null)
                return BadRequest("You already applied for this gig");

            var bid = new Bid
            {
                BidId = Guid.NewGuid(),
                GigId = dto.GigId,
                BidderId = userId,
                Pitch = dto.Pitch,
                ProposedCredits = dto.ProposedCredits,
                Status = BidStatus.Pending,
                CreatedAt = DateTime.UtcNow
            };

            _context.Bids.Add(bid);

            await _context.SaveChangesAsync();

            return Ok(bid);
        }

        [HttpPut("{id}/accept")]
        public async Task<IActionResult> AcceptBid(Guid id)
        {
            var bid = await _context.Bids
                .Include(b => b.Gig)
                .FirstOrDefaultAsync(b => b.BidId == id);

            if (bid == null)
                return NotFound();

            bid.Status = BidStatus.Accepted;
            bid.Gig.Status = GigStatus.Assigned;
            bid.Gig.AssigneeId = bid.BidderId;

            await _context.SaveChangesAsync();

            return Ok("Bid accepted successfully");
        }
    }
}