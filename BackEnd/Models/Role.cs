using System.ComponentModel.DataAnnotations;
using System.Collections.Generic;

namespace ITTicketingSys.BackEnd.Models
{
    public class Role
    {
        [Key]
        public long Id { get; set; } // Matches [Id] bigint

        [Required]
        [MaxLength(100)]
        public string RoleName { get; set; } = string.Empty;

        public int? OrderNo { get; set; } // Matches [OrderNo] int

        [Required]
        [MaxLength(100)]
        public string BusinessEntity { get; set; } = string.Empty;

        public virtual ICollection<AccountRole> AccountRoles { get; set; } = new List<AccountRole>();
    }
}
