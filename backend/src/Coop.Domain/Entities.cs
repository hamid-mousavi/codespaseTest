using System;
using System.Collections.Generic;

namespace Coop.Domain
{
    public class User
    {
        public Guid Id { get; set; }
        public string Username { get; set; } = null!;
        public string Email { get; set; } = null!;
        public string PasswordHash { get; set; } = null!;
        public ICollection<Role> Roles { get; set; } = new List<Role>();
    }

    public class Role
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
    }

    public class Member
    {
        public Guid Id { get; set; }
        public string FullName { get; set; } = null!;
        public string NationalCode { get; set; } = null!;
        public ICollection<Unit> Units { get; set; } = new List<Unit>();
    }

    public class Unit
    {
        public Guid Id { get; set; }
        public string Block { get; set; } = null!;
        public string Phase { get; set; } = null!;
        public decimal Area { get; set; }
        public decimal OwnershipShare { get; set; }
        public Guid MemberId { get; set; }
        public Member? Member { get; set; }
    }

    public class DebtPlan
    {
        public Guid Id { get; set; }
        public string Name { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public ICollection<DebtItem> DebtItems { get; set; } = new List<DebtItem>();
    }

    public class DebtItem
    {
        public Guid Id { get; set; }
        public Guid UnitId { get; set; }
        public Unit? Unit { get; set; }
        public Guid DebtPlanId { get; set; }
        public DebtPlan? DebtPlan { get; set; }
        public decimal Amount { get; set; }
        public DateTime DueDate { get; set; }
        public bool Paid { get; set; }
    }

    public class Payment
    {
        public Guid Id { get; set; }
        public Guid DebtItemId { get; set; }
        public DebtItem? DebtItem { get; set; }
        public decimal Amount { get; set; }
        public DateTime PaidAt { get; set; }
        public string Method { get; set; } = null!; // Online | Manual
        public string? TransactionRef { get; set; }
    }

    public class Document
    {
        public Guid Id { get; set; }
        public string FileName { get; set; } = null!;
        public string ContentType { get; set; } = null!;
        public string Url { get; set; } = null!;
    }

    public class Notification
    {
        public Guid Id { get; set; }
        public Guid? MemberId { get; set; }
        public string Message { get; set; } = null!;
        public DateTime CreatedAt { get; set; }
        public bool Sent { get; set; }
    }

    public class AuditLog
    {
        public Guid Id { get; set; }
        public string Action { get; set; } = null!;
        public string? UserId { get; set; }
        public DateTime Timestamp { get; set; }
        public string? Data { get; set; }
    }

    public class Setting
    {
        public Guid Id { get; set; }
        public string Key { get; set; } = null!;
        public string Value { get; set; } = null!;
    }

    public class RefreshToken
    {
        public Guid Id { get; set; }
        public Guid UserId { get; set; }
        public User? User { get; set; }
        public string Token { get; set; } = null!;
        public DateTime ExpiresAt { get; set; }
        public bool IsRevoked { get; set; }
    }
}
