using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace ITTicketingSys.BackEnd.Models
{
    public class AccountRole
    {
        [Key]
        public long ID { get; set; } // Matches [ID] bigint

        public long RoleID { get; set; }  // Matches [RoleID] bigint
        public long AccountID { get; set; } // Matches [AccountID] bigint

        [MaxLength(100)]
        public string? BusinessEntityName { get; set; } // Matches [BusinessEntityName]

        // Navigation properties
        [ForeignKey("AccountID")] 
        public virtual Account Account { get; set; } = null!;

        [ForeignKey("RoleID")]
        public virtual Role Role { get; set; } = null!;
    }
}
