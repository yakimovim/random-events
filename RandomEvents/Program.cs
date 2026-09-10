using Microsoft.EntityFrameworkCore;
using Quartz;
using RandomEvents.Services;
using RandomEvents.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
  .AddJsonFile("appsettings.json", optional: false)
  .AddJsonFile("appsettings.local.json", optional: true)
  .AddEnvironmentVariables();

// Add services to the container.

builder.Services.AddDbContext<StorageContext>(optionsBuilder => {
  optionsBuilder.UseSqlite("Data Source=app.db");
});

builder.Services.AddQuartz(optionsBuilder =>
{
  optionsBuilder.UseInMemoryStore();
});
builder.Services.AddQuartzHostedService(options => 
{
  options.WaitForJobsToComplete = true;
});

builder.Services.AddSingleton<SchedulerService>();
builder.Services.AddHostedService<InitialSchedulingService>();

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.

app.UseStaticFiles();

app.UseRouting();

app.UseAuthorization();

app.MapControllers();

app.MapFallbackToFile("index.html");

using (var scope = app.Services.CreateScope())
{
  var db = scope.ServiceProvider.GetRequiredService<StorageContext>();

  await db.Database.MigrateAsync();
}

await app.RunAsync();
