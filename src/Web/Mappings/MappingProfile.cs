using AutoMapper;
using StarterApp.Web.Dtos;
using StarterApp.Core.Entities;
using System.Linq;
using System;

namespace StarterApp.Web.Mappings
{
    public class MappingProfile : Profile
    {
        public MappingProfile()
        {
            CreateMap<Item, ItemDto>();
            CreateMap<ItemDto, Item>()
            .ForMember(m => m.ItemId, opt => opt.Ignore())
            .ForMember(m => m.DateAdded, opt => opt.Ignore());
        }
    }
}