using Microsoft.EntityFrameworkCore;
using Quartz;
using RandomEvents.Configuration;
using RandomEvents.Hubs;
using RandomEvents.Services;
using RandomEvents.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
  .AddJsonFile("appsettings.json", optional: false)
  .AddJsonFile("appsettings.local.json", optional: true)
  .AddEnvironmentVariables();

// Add services to the container.

builder.Services.Configure<EmailConfiguration>(builder.Configuration.GetSection("Email"));

builder.Services.AddDbContext<StorageContext>(optionsBuilder => {
  optionsBuilder.UseSqlite("Data Source=.\\Data\\app.db");
});

builder.Services.AddQuartz(optionsBuilder =>
{
  optionsBuilder.UseInMemoryStore();
});
builder.Services.AddQuartzHostedService(options => 
{
  options.WaitForJobsToComplete = true;
});

builder.Services.AddSignalR();

builder.Services.AddSingleton<SchedulerService>();
builder.Services.AddSingleton<EmailService>();
builder.Services.AddHostedService<InitialSchedulingService>();
builder.Services.AddHostedService<InitialLoggingService>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapHub<NotificationsHub>("/api/notifications-hub");

app.MapControllers();

app.MapFallbackToFile("index.html");

using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<StorageContext>();

  await db.Database.MigrateAsync();
}

await app.RunAsync();
