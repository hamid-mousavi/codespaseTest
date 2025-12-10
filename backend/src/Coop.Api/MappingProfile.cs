using AutoMapper;
using Coop.Application.DTOs;
using Coop.Domain;

namespace Coop.Api
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Member, MemberDto>();
            CreateMap<MemberCreateDto, Member>();

            CreateMap<Unit, UnitDto>();
            CreateMap<UnitCreateDto, Unit>();

            CreateMap<DebtPlan, DebtPlanDto>();
            CreateMap<DebtItem, DebtItemDto>();

            CreateMap<Payment, PaymentDto>();
        }
    }
}
