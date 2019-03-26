using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace AzureToolkit.Models
{
    public class AzureToolkitContext : DbContext
    {
        public AzureToolkitContext(DbContextOptions<AzureToolkitContext> options) : base(options)
        { }

        public DbSet<SavedImage> SavedImages { get; set; }

        public DbSet<SavedImageTag> SavedImageTags { get; set; }
    }
}
