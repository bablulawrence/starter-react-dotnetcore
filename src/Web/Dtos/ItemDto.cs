using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using StarterApp.Core.Entities;

namespace StarterApp.Web.Dtos
{
    public class ItemDto
    {
        public string ItemId { get; set; }

        [Required]
        [MaxLength(150)]
        public string Title { get; set; }

        [Required]
        [MaxLength(1000)]
        public string Description { get; set; }

        public string FileName { get; set; }
        public DateTime DateAdded { get; set; }

    }
}