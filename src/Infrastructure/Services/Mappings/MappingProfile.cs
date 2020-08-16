using AutoMapper;
using StarterApp.Core.Entities;
using StarterApp.Infrastructure.Services.Models;
using System.Linq;

namespace StarterApp.Infrastructure.Services.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Item, ItemSm>();
        }
    }
}