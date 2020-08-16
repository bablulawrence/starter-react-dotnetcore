using System;
using System.Collections.Generic;
using Microsoft.Azure.Search;
using Microsoft.Azure.Search.Models;

namespace StarterApp.Infrastructure.Services.Models
{
    public class ItemSm
    {
        [System.ComponentModel.DataAnnotations.Key]
        public string ItemId { get; set; }

        [IsSearchable]
        public string Title { get; set; }

        [IsSearchable]
        public string Description { get; set; }

        public string FileName { get; set; }

        [IsFilterable, IsSortable]
        public DateTime DateAdded { get; set; }
    }
}
