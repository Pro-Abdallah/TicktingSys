using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ITTicketingSys.BackEnd.Data;
using ITTicketingSys.BackEnd.Models;
using System.Security.Cryptography;
using System.Text;

namespace ITTicketingSys.BackEnd.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly ApplicationDbContext _context;

        public AuthController(ApplicationDbContext context)
        {
            _context = context;
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            try
            {
                if (string.IsNullOrEmpty(request.Email) || string.IsNullOrEmpty(request.Password))
                {
                    return BadRequest(new { success = false, message = "Email and password are required" });
                }

                // Step 1: Find login by email
                var login = await _context.Logins
                    .FirstOrDefaultAsync(l => l.Email == request.Email);

                if (login == null)
                {
                    return Unauthorized(new { success = false, message = "Invalid email or password" });
                }

                // Step 2: Verify password (SHA-256)
                var passwordHash = ComputeSha256Hash(request.Password);
                if (passwordHash != login.PasswordHash)
                {
                    return Unauthorized(new { success = false, message = "Invalid email or password" });
                }

                // Step 3: Get account information
                var account = await _context.Accounts
                    .FirstOrDefaultAsync(a => a.Id == login.AccountId);

                if (account == null)
                {
                    return NotFound(new { success = false, message = "Account not found" });
                }

                // Step 4: Get roles via AccountRoles junction table
                var roles = await _context.AccountRoles
                    .Where(ar => ar.AccountID == login.AccountId)
                    .Join(_context.Roles.Where(r => r.BusinessEntity == "TicTrack"),
                          ar => ar.RoleID,
                          r => r.Id,
                          (ar, r) => r)
                    .ToListAsync();

                if (!roles.Any())
                {
                    // Fallback: Check if there's a direct role on the account (RoleId column)
                    if (account.RoleId.HasValue)
                    {
                        var directRole = await _context.Roles.FirstOrDefaultAsync(r => r.Id == account.RoleId.Value);
                        if (directRole != null && directRole.BusinessEntity == "TicTrack")
                        {
                            roles.Add(directRole);
                        }
                    }

                    if (!roles.Any())
                    {
                         return StatusCode(403, new { success = false, message = "No TicTrack role found for this account" });
                    }
                }

                var primaryRole = roles.First();

                // Step 5: Determine portal based on role
                var studentRoles = new[] { "Student" };
                var itPortalRoles = new[] { "IT", "Teacher", "TechStaff", "Reviewer", "Board" };

                var portalType = "unknown";
                if (studentRoles.Contains(primaryRole.RoleName))
                {
                    portalType = "student";
                }
                else if (itPortalRoles.Contains(primaryRole.RoleName))
                {
                    portalType = "it";
                }

                // Step 6: Return user info and portal type
                return Ok(new
                {
                    success = true,
                    user = new
                    {
                        accountId = account.Id,
                        email = account.Email,
                        fullNameEN = account.FullNameEN,
                        fullNameAR = account.FullNameAR,
                        phone = account.Phone,
                        role = primaryRole.RoleName,
                        portalType
                    }
                });
            }
            catch (Exception ex)
            {
                // Log exception details (in a real app, use a logger)
                Console.WriteLine($"Login error: {ex}");
                return StatusCode(500, new { success = false, message = "An internal server error occurred", error = ex.Message });
            }
        }

        private static string ComputeSha256Hash(string rawData)
        {
            // Create a SHA256   
            using (SHA256 sha256Hash = SHA256.Create())
            {
                // ComputeHash - returns byte array  
                byte[] bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(rawData));

                // Convert byte array to a string   
                StringBuilder builder = new StringBuilder();
                for (int i = 0; i < bytes.Length; i++)
                {
                    builder.Append(bytes[i].ToString("x2"));
                }
                return builder.ToString();
            }
        }
    }

    public class LoginRequest
    {
        public string Email { get; set; } = string.Empty;
        public string Password { get; set; } = string.Empty;
    }
}
