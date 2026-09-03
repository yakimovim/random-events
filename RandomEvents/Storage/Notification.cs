using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace RandomEvents.Storage;

public class Notification
{
  [Key, DatabaseGenerated(DatabaseGeneratedOption.Identity)]
  public int Id { get; set; }

  public DateTimeOffset Moment { get; set; } = DateTimeOffset.Now;

  [MaxLength(256)]
  [Required]
  public string Name { get; set; } = string.Empty;

  [MaxLength(2048)]
  public string? Description { get; set; }
}
