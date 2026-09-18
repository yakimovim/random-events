using System.ComponentModel.DataAnnotations;

namespace RandomEvents.Models;

public class CreateEventRequestModel
{
  public DateTimeOffset NextMoment { get; set; } = DateTimeOffset.Now;

  [Range(minimum: 1, maximum: uint.MaxValue)]
  public uint AverageDaysOffset { get; set; } = 1;

  [Range(minimum: 1, maximum: uint.MaxValue)]
  public uint DaysSpread { get; set; } = 1;

  [MaxLength(256)]
  [Required]
  public string Name { get; set; } = string.Empty;

  [MaxLength(2048)]
  public string? Description { get; set; }
}