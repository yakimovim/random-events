using Microsoft.EntityFrameworkCore;
using Quartz;
using RandomEvents.Services;
using RandomEvents.Storage;

namespace RandomEvents.Jobs;

internal class EventJob : IJob
{
  private readonly StorageContext _db;
  private readonly SchedulerService _schedulerService;

  public EventJob(
    StorageContext db,
    SchedulerService schedulerService)
  {
    _db = db ?? throw new ArgumentNullException(nameof(db));
    _schedulerService = schedulerService ?? throw new ArgumentNullException(nameof(schedulerService));
  }

  public async ValueTask Execute(
    IJobExecutionContext context,
    CancellationToken cancellationToken = default)
  {
    var eventId = int.Parse(context.JobDetail.Key.Name);

    var @event = await _db.Events.FindAsync([eventId], cancellationToken);

    if (@event is null)
    {
      return;
    }

    await _schedulerService.ScheduleEventAsync(@event, cancellationToken);
  }
}
