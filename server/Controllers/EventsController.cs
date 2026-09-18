using Mapster;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RandomEvents.Models;
using RandomEvents.Services;
using RandomEvents.Storage;

namespace RandomEvents.Controllers;

[ApiController]
[Route("api/events")]
public class EventsController : ControllerBase
{
  private readonly StorageContext _db;
  private readonly SchedulerService _schedulerService;

  public EventsController(StorageContext db, SchedulerService schedulerService)
  {
    _db = db ?? throw new ArgumentNullException(nameof(db));
    _schedulerService = schedulerService ?? throw new ArgumentNullException(nameof(schedulerService));
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Event>>> GetAll(CancellationToken cancellationToken)
  {
    return Ok(await _db.Events.AsNoTracking().ToArrayAsync(cancellationToken));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Event>> Get(int id, CancellationToken cancellationToken)
  {
    var @event = await _db.Events.FindAsync([id], cancellationToken);

    if (@event is null)
    {
      return NotFound();
    }

    return Ok(@event);
  }

  [HttpDelete("{id}")]
  public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
  {
    var @event = await _db.Events.FindAsync([id], cancellationToken);

    if (@event is null)
    {
      return NotFound();
    }

    _db.Events.Remove(@event);

    await _db.SaveChangesAsync(cancellationToken);

    await _schedulerService.DeleteEventAsync(id, cancellationToken);

    return Ok();
  }

  [HttpPost]
  public async Task<ActionResult<Event>> Create(CreateEventRequestModel model, CancellationToken cancellationToken)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var @event = model.Adapt<Event>();

    _db.Events.Add(@event);

    await _db.SaveChangesAsync(cancellationToken);

    await _schedulerService.ScheduleEventAsync(@event, cancellationToken);

    return Ok(@event);
  }


  [HttpPost("import")]
  public async Task<IActionResult> Import(CreateEventRequestModel[] models, CancellationToken cancellationToken)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var events = models.Select(m => m.Adapt<Event>()).ToArray();

    _db.Events.AddRange(events);

    await _db.SaveChangesAsync(cancellationToken);

    foreach (var @event in events)
    {
      await _schedulerService.ScheduleEventAsync(@event, cancellationToken);
    }

    return Ok();
  }

  [HttpPut("{id}")]
  public async Task<ActionResult<Event>> Update(int id, CreateEventRequestModel model, CancellationToken cancellationToken)
  {
    if (!ModelState.IsValid)
    {
      return BadRequest(ModelState);
    }

    var @event = await _db.Events.FindAsync([id], cancellationToken);

    if (@event is null)
    {
      return NotFound();
    }

    model.Adapt(@event);

    await _db.SaveChangesAsync(cancellationToken);

    await _schedulerService.ScheduleEventAsync(@event, cancellationToken);

    return Ok(@event);
  }
}
