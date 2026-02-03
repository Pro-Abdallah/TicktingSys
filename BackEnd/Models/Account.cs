using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using System.Text.Json.Serialization;

namespace ITTicketingSys.BackEnd.Models
{
    public class Account
    {
        [Key]
        public long Id { get; set; }  // Matches [Id] bigint

        [Required]
        [MaxLength(20)]
        public string NationalId { get; set; } = string.Empty;

        [MaxLength(500)]
        public string PasswordHash { get; set; } = string.Empty;

        [Required]
        [MaxLength(255)]
        public string Email { get; set; } = string.Empty;

        [MaxLength(50)]
        public string? Phone { get; set; }

        public long? RoleId { get; set; }  // Matches [RoleId] bigint

        [Required]
        [MaxLength(255)]
        public string FullNameEN { get; set; } = string.Empty;

        [MaxLength(255)]
        public string? FullNameAR { get; set; }

        public string? ResetToken { get; set; }
        public DateTime? ResetTokenExpiry { get; set; }
        
        public DateTime Created_at { get; set; }
        public bool IsActive { get; set; }
        public long? StatusId { get; set; } // Matches [StatusId] bigint

        // Navigation properties
        [JsonIgnore]
        public virtual Login? Login { get; set; }
        
        [JsonIgnore]
        public virtual ICollection<AccountRole> AccountRoles { get; set; } = new List<AccountRole>();
        
        [JsonIgnore]
        public virtual ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();
        
        [JsonIgnore]
        public virtual ICollection<Ticket> CreatedTickets { get; set; } = new List<Ticket>();
        
        [JsonIgnore]
        public virtual ICollection<Ticket> AssignedTickets { get; set; } = new List<Ticket>();
    }
}
