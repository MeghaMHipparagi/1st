using System;
using System.ComponentModel.DataAnnotations;

namespace CampusGig.API.DTOs.Gigs
{
    public class CreateGigDto
    {
        [Required]
        [StringLength(200, MinimumLength = 10)]
        public string Title { get; set; } = string.Empty;

        [Required]
        [StringLength(4000, MinimumLength = 50)]
        public string Description { get; set; } = string.Empty;

        [Required]
        public string Category { get; set; } = string.Empty;

        [Required]
        [Range(1, 5000, ErrorMessage = "Reward credits must be between 1 and 5000.")]
        public decimal RewardCredits { get; set; }

        [Required]
        public DateTime Deadline { get; set; }
    }
}