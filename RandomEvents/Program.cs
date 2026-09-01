using Microsoft.EntityFrameworkCore;
using RandomEvents.Storage;

var builder = WebApplication.CreateBuilder(args);

builder.Configuration
  .AddJsonFile("appsettings.json", optional: false)
  .AddJsonFile("appsettings.local.json", optional: true)
  .AddEnvironmentVariables();

// Add services to the container.

builder.Services.AddDbContext<StorageContext>(options  => {
  options.UseSqlite("app.data");
});

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
