using Microsoft.Extensions.Options;
using RandomEvents.Configuration;

namespace RandomEvents.Services;

public class InitialLoggingService : BackgroundService
{
  private readonly ILogger<InitialLoggingService> _logger;
  private readonly EmailConfiguration _emailConfiguration;

  public InitialLoggingService(
    ILogger<InitialLoggingService> logger,
    IOptions<EmailConfiguration> emailOptions
    )
  {
    _logger = logger;
    _emailConfiguration = emailOptions.Value;
  }

  protected override async Task ExecuteAsync(CancellationToken stoppingToken)
  {
#pragma warning disable S6664
    _logger.LogInformation(
      "Email server: {EmailServerHost}:{EmailServerPort}", 
      _emailConfiguration.SmtpServerHost,
      _emailConfiguration.SmtpServerPort);
    _logger.LogInformation("Email server user: {EmailServerUser}:{EmailServerPassword}", 
      _emailConfiguration.SmtpServerUser,
      string.IsNullOrWhiteSpace(_emailConfiguration.SmtpServerPassword) ? "" : "****");
    _logger.LogInformation("Email sender: {EmailSender}",
      _emailConfiguration.FromAddress);
    _logger.LogInformation("Email recipient: {EmailRecipient}",
      _emailConfiguration.ToAddress);
#pragma warning restore S6664
  }
}
