using System.ComponentModel.DataAnnotations;

namespace RandomEvents.Storage;

public class Notification
{
  [Key]
  public int Id { get; set; }

  public DateTimeOffset NextMoment { get; set; } = DateTimeOffset.Now;

  [MaxLength(256)]
  [Required]
  public string Name { get; set; } = string.Empty;

  [MaxLength(2048)]
  public string? Description { get; set; }
}
