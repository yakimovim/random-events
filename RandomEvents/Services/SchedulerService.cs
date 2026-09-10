using Mapster;
using Microsoft.EntityFrameworkCore;
using Quartz;
using RandomEvents.Jobs;
using RandomEvents.Storage;

namespace RandomEvents.Services;

public class SchedulerService
{
  private readonly IServiceProvider _serviceProvider;
  private readonly IScheduler _scheduler;

  public SchedulerService(IServiceProvider serviceProvider, IScheduler scheduler)
  {
    _serviceProvider = serviceProvider ?? throw new ArgumentNullException(nameof(serviceProvider));
    _scheduler = scheduler ?? throw new ArgumentNullException(nameof(scheduler));
  }

  public async Task ScheduleEventAsync(Event @event, CancellationToken cancellationToken)
  {
    var now = DateTimeOffset.UtcNow;

    if (@event.NextMoment <= now)
    {
      using var scope = _serviceProvider.CreateScope();
      using var db = scope.ServiceProvider.GetRequiredService<StorageContext>();

      while (@event.NextMoment <= now)
      {
        var notification = @event.Adapt<Notification>();
        notification.Id = 0;

        db.Notifications.Add(notification);

        @event.NextMoment = @event.NextMoment.AddDays(GetDaysOffset(@event));
      }

      db.Events.Add(@event);
      db.Entry(@event).State = EntityState.Modified;

      await db.SaveChangesAsync(cancellationToken);
    }

    var jobKey = new JobKey(@event.Id.ToString());

    await _scheduler.DeleteJob(jobKey, cancellationToken);

    var job = JobBuilder.Create<EventJob>()
      .WithIdentity(jobKey)
      .Build();

    var trigger = TriggerBuilder.Create()
      .StartAt(@event.NextMoment)
      .Build();

    await _scheduler.ScheduleJob(job, trigger, cancellationToken: cancellationToken);
  }

  private static uint GetDaysOffset(Event @event)
  {
    return @event.AverageDaysOffset - @event.DaysSpread + (uint)Random.Shared.Next((int)(2 * @event.DaysSpread));
  }

  public async Task DeleteEventAsync(int eventId, CancellationToken cancellationToken)
  {
    var jobKey = new JobKey(eventId.ToString());

    await _scheduler.DeleteJob(jobKey, cancellationToken);
  }
}
