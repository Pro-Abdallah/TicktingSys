using Microsoft.EntityFrameworkCore;
using ITTicketingSys.BackEnd.Models;

namespace ITTicketingSys.BackEnd.Data
{
    public class ApplicationDbContext : DbContext
    {
        public ApplicationDbContext(DbContextOptions<ApplicationDbContext> options)
            : base(options)
        {
        }

        public ApplicationDbContext() : base()
        {
        }

        // DbSets for tables
        public DbSet<Account> Accounts { get; set; }
        public DbSet<Role> Roles { get; set; }
        public DbSet<AccountRole> AccountRoles { get; set; }
        public DbSet<Login> Logins { get; set; }
        public DbSet<Department> Departments { get; set; }
        public DbSet<Ticket> Tickets { get; set; }
        public DbSet<TicketComment> TicketComments { get; set; }
        public DbSet<Attachment> Attachments { get; set; }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            // Account configuration
            modelBuilder.Entity<Account>(entity =>
            {
                entity.ToTable("Account");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.NationalId).HasMaxLength(20);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Phone).HasMaxLength(50);
                entity.Property(e => e.FullNameEN).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FullNameAR).HasMaxLength(255);
                entity.Property(e => e.Created_at).HasColumnType("datetime");
            });

            // Role configuration
            modelBuilder.Entity<Role>(entity =>
            {
                entity.ToTable("Roles");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.RoleName).IsRequired().HasMaxLength(100);
                entity.Property(e => e.BusinessEntity).IsRequired().HasMaxLength(100);
            });

            // AccountRole configuration
            modelBuilder.Entity<AccountRole>(entity =>
            {
                entity.ToTable("AccountRoles");
                entity.HasKey(e => e.ID);

                entity.Property(e => e.AccountID).HasColumnName("AccountID");
                entity.Property(e => e.RoleID).HasColumnName("RoleID");

                // Relationships
                entity.HasOne(ar => ar.Account)
                    .WithMany(a => a.AccountRoles)
                    .HasForeignKey(ar => ar.AccountID)
                    .OnDelete(DeleteBehavior.Cascade);

                entity.HasOne(ar => ar.Role)
                    .WithMany(r => r.AccountRoles)
                    .HasForeignKey(ar => ar.RoleID)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Login configuration
            modelBuilder.Entity<Login>(entity =>
            {
                entity.ToTable("Login");
                entity.HasKey(e => e.Id);
                entity.Property(e => e.Email).IsRequired().HasMaxLength(255);
                entity.Property(e => e.PasswordHash).IsRequired().HasMaxLength(500);

                // One-to-One relationship with Account
                entity.HasOne(l => l.Account)
                    .WithOne(a => a.Login)
                    .HasForeignKey<Login>(l => l.AccountId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Department configuration
            modelBuilder.Entity<Department>(entity =>
            {
                entity.ToTable("Departments");
                entity.HasKey(e => e.DepartmentId);
                entity.Property(e => e.Name).IsRequired().HasMaxLength(100);
                entity.Property(e => e.Description).HasMaxLength(500);
            });

            // Ticket configuration
            modelBuilder.Entity<Ticket>(entity =>
            {
                entity.ToTable("Tickets");
                entity.HasKey(e => e.TicketId);
                entity.Property(e => e.Title).IsRequired().HasMaxLength(255);
                entity.Property(e => e.Description).IsRequired();
                entity.Property(e => e.IPAddress).HasMaxLength(45);
                entity.Property(e => e.Priority).IsRequired();
                entity.Property(e => e.Status).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();
                entity.Property(e => e.UpdatedAt);

                // Relationship: Ticket -> CreatedBy (Account)
                // Note: CreatedById and AssignedToId in Ticket are still int, might need update later if Ticket IDs are also bigint
                // For now, assuming Ticket references Account Id which is now long.
                // WE MUST UPDATE Ticket.cs to use long for Account references!
                
                // Let's assume Ticket foreign keys need to be long too if Account.Id is long
                
                 entity.HasOne(t => t.CreatedBy)
                     .WithMany(a => a.CreatedTickets)
                     .HasForeignKey("CreatedById") // Using string because we haven't updated Ticket model yet
                     .OnDelete(DeleteBehavior.Restrict);

                 entity.HasOne(t => t.AssignedTo)
                     .WithMany(a => a.AssignedTickets)
                     .HasForeignKey("AssignedToId")
                     .OnDelete(DeleteBehavior.SetNull);

                // Relationship: Ticket -> Department
                entity.HasOne(t => t.Department)
                    .WithMany(d => d.Tickets)
                    .HasForeignKey(t => t.DepartmentId)
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // TicketComment configuration
            modelBuilder.Entity<TicketComment>(entity =>
            {
                entity.ToTable("TicketComments");
                entity.HasKey(e => e.CommentId);
                entity.Property(e => e.Content).IsRequired();
                entity.Property(e => e.CreatedAt).IsRequired();

                // Relationship: TicketComment -> Ticket
                entity.HasOne(tc => tc.Ticket)
                    .WithMany(t => t.Comments)
                    .HasForeignKey(tc => tc.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);

                // Relationship: TicketComment -> Account
                // AccountId needs to be long here too
                entity.HasOne(tc => tc.Account)
                    .WithMany(a => a.Comments)
                    .HasForeignKey("AccountId")
                    .OnDelete(DeleteBehavior.Restrict);
            });

            // Attachment configuration
            modelBuilder.Entity<Attachment>(entity =>
            {
                entity.ToTable("Attachments");
                entity.HasKey(e => e.AttachmentId);
                entity.Property(e => e.FileName).IsRequired().HasMaxLength(255);
                entity.Property(e => e.FilePath).IsRequired().HasMaxLength(500);
                entity.Property(e => e.UploadedAt).IsRequired();

                // Relationship: Attachment -> Ticket
                entity.HasOne(a => a.Ticket)
                    .WithMany(t => t.Attachments)
                    .HasForeignKey(a => a.TicketId)
                    .OnDelete(DeleteBehavior.Cascade);
            });

            // Global Query Filters
             modelBuilder.Entity<Role>()
                .HasQueryFilter(r => r.BusinessEntity == "TicTrack");
        }
    }
}
