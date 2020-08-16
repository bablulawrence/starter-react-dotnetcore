using System;
using System.Collections.Generic;

namespace StarterApp.Core.Entities
{
    public class Item
    {
        public int ItemId { get; set; }
        public string Title { get; set; }
        public string Description { get; set; }
        public string FileName { get; set; }
        public DateTime DateAdded { get; set; }
    }
}