using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using ITTicketingSys.BackEnd.Enums;

namespace ITTicketingSys.BackEnd.Models
{
    public class Ticket
    {
        [Key]
        public int TicketId { get; set; }

        [Required]
        [MaxLength(255)]
        public string Title { get; set; } = string.Empty;

        [Required]
        public string Description { get; set; } = string.Empty;

        [MaxLength(45)]
        public string? IPAddress { get; set; }

        public TicketPriority Priority { get; set; }
        public TicketStatus Status { get; set; }

        public long CreatedById { get; set; }  // Changed to long to match Account.Id
        public long? AssignedToId { get; set; } // Changed to long to match Account.Id

        public int DepartmentId { get; set; }

        public DateTime CreatedAt { get; set; }
        public DateTime? UpdatedAt { get; set; }

        // Navigation properties
        [ForeignKey("CreatedById")]
        public virtual Account CreatedBy { get; set; } = null!;

        [ForeignKey("AssignedToId")]
        public virtual Account? AssignedTo { get; set; }

        [ForeignKey("DepartmentId")]
        public virtual Department Department { get; set; } = null!;

        public virtual ICollection<TicketComment> Comments { get; set; } = new List<TicketComment>();
        public virtual ICollection<Attachment> Attachments { get; set; } = new List<Attachment>();
    }
}
