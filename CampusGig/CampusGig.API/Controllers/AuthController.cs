using Microsoft.AspNetCore.Mvc;
// using CampusGig.API.Data; // Commented out until Person 1 creates it
// using CampusGig.API.Models; // Commented out until Person 1 creates it
using CampusGig.API.DTOs.Auth;
using CampusGig.API.Helpers;

namespace CampusGig.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        // Commenting out DB reference until Person 1 pushes the database architecture
        // private readonly AppDbContext _context; 
        private readonly JwtHelper _jwtHelper;

        public AuthController(JwtHelper jwtHelper)
        {
            _jwtHelper = jwtHelper;
        }

        [HttpPost("register")]
        public IActionResult Register([FromBody] RegisterDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Mock response until Person 1 implements AppDbContext
            return Ok(new { message = "Registration endpoint wired successfully. Waiting for DB layer." });
        }

        [HttpPost("login")]
        public IActionResult Login([FromBody] LoginDto dto)
        {
            if (!ModelState.IsValid)
                return BadRequest(ModelState);

            // Mock JWT Generation until Profile models are active
            var tokenStr = _jwtHelper.GenerateToken(Guid.NewGuid(), "TestUser", dto.Email);

            var response = new AuthResponseDto
            {
                Token = tokenStr,
                UserId = Guid.NewGuid(),
                Username = "TestUser",
                WalletBalance = 500.00m
            };

            return Ok(response);
        }
    }
}