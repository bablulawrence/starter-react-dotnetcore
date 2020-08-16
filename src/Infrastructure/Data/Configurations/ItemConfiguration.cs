using StarterApp.Core.Entities;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace StarterApp.Infrastructure.Data.Configurations
{
    public class ItemConfiguration : IEntityTypeConfiguration<Item>
    {
        public void Configure(EntityTypeBuilder<Item> builder)
        {
            builder.HasKey(cn => cn.ItemId);

            builder.Property(cn => cn.Title)
                .HasMaxLength(150)
                .IsRequired();

            builder.Property(cn => cn.Description)
                .HasMaxLength(1000)
                .IsRequired();

            builder.Property(cn => cn.FileName)
                .HasMaxLength(200)
                .IsRequired();

            builder.Property(cn => cn.DateAdded)
                .IsRequired();
        }
    }
}