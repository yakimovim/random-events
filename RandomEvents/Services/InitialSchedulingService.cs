using Microsoft.EntityFrameworkCore;
using RandomEvents.Storage;

namespace RandomEvents.Services;

internal class InitialSchedulingService : BackgroundService
{
  private readonly IServiceProvider _serviceProvider;
  private readonly SchedulerService _scheduler;

  public InitialSchedulingService(IServiceProvider serviceProvider, SchedulerService scheduler)
  {
    _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    _scheduler = scheduler ?? throw new ArgumentNullException(nameof(scheduler));
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
    using var scope = _serviceProvider.CreateScope();
    using var db = scope.ServiceProvider.GetRequiredService<StorageContext>();

    var events = await db.Events.AsNoTracking().ToArrayAsync(stoppingToken);

    foreach(var @event in events)
    {
      await _scheduler.ScheduleEventAsync(@event, stoppingToken);
    }
  }
}
