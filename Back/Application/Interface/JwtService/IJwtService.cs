using Back.Api.Models;

namespace Back.Application.Interface.JwtService;

public interface IJwtService
{
    Users Auth(string email, string password);
    string GenerateToken();
}