using Microsoft.EntityFrameworkCore;

namespace RandomEvents.Storage;

public class StorageContext : DbContext
{
  public StorageContext(DbContextOptions<StorageContext> options)
    : base(options)
  { }

  public DbSet<Event> Events { get; set; }
  public DbSet<Notification> Notifications { get; set; }
}
