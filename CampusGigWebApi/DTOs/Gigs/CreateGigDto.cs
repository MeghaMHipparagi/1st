using System.ComponentModel.DataAnnotations;

namespace CampusGigWebApi.DTOs.Gigs
{
    public class CreateGigDto
    {
        [Required]
        [StringLength(100)]
        public string Title { get; set; }

        [Required]
        [StringLength(500)]
        public string Description { get; set; }

        [Required]
        public string Category { get; set; }

        [Required]
        [Range(1, 10000)]
        public decimal RewardCredits { get; set; }

        [Required]
        public DateTime Deadline { get; set; }
    }
}