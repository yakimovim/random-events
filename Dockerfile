FROM node:25-slim AS frontend-build
WORKDIR /app

COPY ./frontend/package*.json ./
RUN npm i

COPY ./frontend ./
RUN npm run build

FROM mcr.microsoft.com/dotnet/sdk:10.0 AS server-build
WORKDIR /app

COPY ./server/RandomEvents.csproj ./
RUN dotnet restore

COPY ./server ./
RUN dotnet publish -c Release -o /app/publish /p:UseAppHost=false

FROM mcr.microsoft.com/dotnet/aspnet:10.0 AS final
WORKDIR /app
EXPOSE 5000

COPY --from=server-build /app/publish .

COPY --from=frontend-build /app/dist ./wwwroot

ENTRYPOINT ["dotnet", "RandomEvents.dll", "--urls", "http://*:5000"]
