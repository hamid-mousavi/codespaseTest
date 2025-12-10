using System;

namespace Coop.Application.DTOs
{
    public record AuthRequest(string Username, string Password);
    public record AuthResponse(string AccessToken, string RefreshToken, DateTime ExpiresAt);

    public record PaymentCreateDto(Guid DebtItemId, decimal Amount, string Method);
    public record PaymentDto(Guid Id, Guid DebtItemId, decimal Amount, DateTime PaidAt, string Method, string? TransactionRef);

    public record MemberCreateDto(string FullName, string NationalCode);
    public record MemberDto(Guid Id, string FullName, string NationalCode);

    public record UnitCreateDto(Guid MemberId, string Block, string Phase, decimal Area, decimal OwnershipShare);
    public record UnitDto(Guid Id, Guid MemberId, string Block, string Phase, decimal Area, decimal OwnershipShare);

    public record DebtPlanDto(Guid Id, string Name, DateTime CreatedAt);
    public record DebtItemDto(Guid Id, Guid UnitId, Guid DebtPlanId, decimal Amount, DateTime DueDate, bool Paid);

    public record ReportDebtSummaryDto(decimal TotalDebt, decimal TotalPaid, int DebtorCount);
}
