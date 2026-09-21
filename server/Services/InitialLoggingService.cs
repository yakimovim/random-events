using Microsoft.Data.Sqlite;
using Microsoft.Extensions.Options;
using RandomEvents.Configuration;
using RandomEvents.Storage;

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
    LogEmailSettings();

    LogDbSettings();
  }

  private void LogEmailSettings()
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

  private void LogDbSettings()
  {
    using (var connection = new SqliteConnection(ConnectionStringProvider.GetConnectionString()))
    {
      connection.Open();
      using (var command = new SqliteCommand("PRAGMA database_list;", connection))
      using (var reader = command.ExecuteReader())
      {
        while (reader.Read())
        {
          _logger.LogInformation("Database name: {DatabaseName}, Location: {DatabaseFile}", reader["name"], reader["file"]);
        }
      }
    }
  }
}