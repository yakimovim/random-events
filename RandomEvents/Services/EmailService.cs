using Microsoft.Extensions.Options;
using RandomEvents.Configuration;
using RandomEvents.Storage;
using System.Net;
using System.Net.Mail;

namespace RandomEvents.Services;

public class EmailService
{
  private readonly EmailConfiguration _configuration;

  public EmailService(IOptions<EmailConfiguration> options)
  {
    _configuration = options.Value;
  }

  public async Task SendNotificationAsync(Notification notification, CancellationToken cancellationToken)
  {
    if (string.IsNullOrWhiteSpace(_configuration.SmtpServerHost))
    {
      return;
    }

    using var smtpClient = new SmtpClient(_configuration.SmtpServerHost, _configuration.SmtpServerPort)
    {
      EnableSsl = true,
      Timeout = 10000,
    };

    if (!string.IsNullOrWhiteSpace(_configuration.SmtpServerPassword))
    {
      smtpClient.Credentials = new NetworkCredential(_configuration.SmtpServerUser, _configuration.SmtpServerPassword);
    }

    var fromAddress = new MailAddress(_configuration.FromAddress);
    var toAddress = new MailAddress(_configuration.ToAddress);

    var message = new MailMessage(fromAddress, toAddress) 
    { 
      Subject = $"🕑 {notification.Name}",
      Body = notification.Description,
      IsBodyHtml = false,
    };

    await smtpClient.SendMailAsync(message, cancellationToken);
  }
}
