namespace ITTicketingSys.BackEnd.Models
{
    public class Attachment
    {
        public int AttachmentId { get; set; }
        public int TicketId { get; set; }
        public string FileName { get; set; } = string.Empty;
        public string FilePath { get; set; } = string.Empty;
        public DateTime UploadedAt { get; set; }

        // Navigation properties
        public virtual Ticket Ticket { get; set; } = null!;
    }
}
