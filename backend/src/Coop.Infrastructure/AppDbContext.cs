using Microsoft.EntityFrameworkCore;
using Coop.Domain;
using System;

namespace Coop.Infrastructure
{
    public class AppDbContext : DbContext
    {
        public AppDbContext(DbContextOptions<AppDbContext> opts) : base(opts)
        {
        }

        public DbSet<User> Users => Set<User>();
        public DbSet<Role> Roles => Set<Role>();
        public DbSet<Member> Members => Set<Member>();
        public DbSet<Unit> Units => Set<Unit>();
        public DbSet<DebtPlan> DebtPlans => Set<DebtPlan>();
        public DbSet<DebtItem> DebtItems => Set<DebtItem>();
        public DbSet<Payment> Payments => Set<Payment>();
        public DbSet<Document> Documents => Set<Document>();
        public DbSet<Notification> Notifications => Set<Notification>();
        public DbSet<AuditLog> AuditLogs => Set<AuditLog>();
        public DbSet<Setting> Settings => Set<Setting>();

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            base.OnModelCreating(modelBuilder);

            modelBuilder.Entity<User>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.Username).IsUnique();
                b.HasIndex(x => x.Email).IsUnique();
            });

            modelBuilder.Entity<Member>(b =>
            {
                b.HasKey(x => x.Id);
                b.HasIndex(x => x.NationalCode).IsUnique();
            });

            modelBuilder.Entity<Unit>(b =>
            {
                b.HasOne(x => x.Member).WithMany(x => x.Units).HasForeignKey(x => x.MemberId);
            });

            // Seed a default admin role and user
            var adminRoleId = Guid.Parse("11111111-1111-1111-1111-111111111111");
            var adminUserId = Guid.Parse("22222222-2222-2222-2222-222222222222");

            modelBuilder.Entity<Role>().HasData(new Role { Id = adminRoleId, Name = "Administrator" });
            modelBuilder.Entity<User>().HasData(new User
            {
                Id = adminUserId,
                Username = "admin",
                Email = "admin@coop.local",
                PasswordHash = "TODO_HASH" // developer should replace with a real hash during deployment/seeding
            });
        }
    }
}
