namespace RandomEvents.Storage;

internal static class ConnectionStringProvider
{
  public static string GetConnectionString()
    => $"Data Source=.{Path.DirectorySeparatorChar}Data{Path.DirectorySeparatorChar}app.db";
}
