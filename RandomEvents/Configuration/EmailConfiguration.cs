namespace RandomEvents.Configuration;

public class EmailConfiguration
{
  public string? SmtpServerHost { get; set; }
  public int SmtpServerPort { get; set; }
  public string? SmtpServerUser { get; set; }
  public string? SmtpServerPassword { get; set; }
  public string ToAddress { get; set; } = string.Empty;
  public string FromAddress { get; set; } = string.Empty;
}
