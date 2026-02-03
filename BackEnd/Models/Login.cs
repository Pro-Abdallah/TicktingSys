using System.ComponentModel.DataAnnotations;

namespace ITTicketingSys.BackEnd.Models
{
    public class Login
    {
        [Key]
        public long Id { get; set; }  // Matches [Id] bigint

        [Required]
        public long AccountId { get; set; } // Matches [AccountId] bigint

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [Required]
        [MaxLength(500)]
        public string PasswordHash { get; set; } = string.Empty;

        public long? StatusId { get; set; }  // Matches [StatusId] bigint

        // Navigation property
        public virtual Account Account { get; set; } = null!;
    }
}
