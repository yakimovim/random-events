using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using RandomEvents.Storage;

namespace RandomEvents.Controllers;

[ApiController]
[Route("api/notifications")]
public class NotificationsController : ControllerBase
{
  private readonly StorageContext _db;

  public NotificationsController(StorageContext db)
  {
    _db = db ?? throw new ArgumentNullException(nameof(db));
  }

  [HttpGet]
  public async Task<ActionResult<IEnumerable<Notification>>> GetAll(CancellationToken cancellationToken)
  {
    return Ok(await _db.Notifications.AsNoTracking().ToArrayAsync(cancellationToken));
  }

  [HttpGet("{id}")]
  public async Task<ActionResult<Notification>> Get(int id, CancellationToken cancellationToken)
  {
    var notification = await _db.Notifications.FindAsync([id], cancellationToken);

    if (notification is null)
    {
      return NotFound();
    }

    return Ok(notification);
  }

  [HttpDelete]
  public async Task<IActionResult> Delete(int id, CancellationToken cancellationToken)
  {
    var notification = await _db.Notifications.FindAsync([id], cancellationToken);

    if (notification is null)
    {
      return NotFound();
    }

    _db.Notifications.Remove(notification);

    await _db.SaveChangesAsync(cancellationToken);

    return Ok();
  }
}
