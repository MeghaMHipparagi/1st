using System;

namespace CampusGig.API.DTOs.Auth
{
    public class AuthResponseDto
    {
        public string Token { get; set; } = string.Empty;
        public Guid UserId { get; set; }
        public string Username { get; set; } = string.Empty;
        public decimal WalletBalance { get; set; }
    }
}