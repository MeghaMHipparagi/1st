using System.ComponentModel.DataAnnotations;

namespace CampusGigWebApi.DTOs.Bids
{
    public class CreateBidDto
    {
        [Required]
        public Guid GigId { get; set; }

        [Required]
        [StringLength(300)]
        public string Pitch { get; set; }

        [Required]
        [Range(1, 10000)]
        public decimal ProposedCredits { get; set; }
    }
}