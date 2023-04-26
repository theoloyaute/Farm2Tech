using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;
using Back.Api.Models;
using Back.Application.Interface.JwtService;
using Back.Infrastructure.Context;
using Microsoft.IdentityModel.Tokens;

namespace Back.Application.Service.JwtService;

public class JwtService : IJwtService
{
    public readonly IConfiguration _conf;
    public readonly AppDbContext _context;
    
    public JwtService(IConfiguration conf, AppDbContext context)
    {
        _conf = conf;
        _context = context;
    }
    
    public Users Auth(string email, string password)
    {
        var user = _context.Users.FirstOrDefault(x => x.Email == email.ToLower());
        if (user is null || !BCrypt.Net.BCrypt.Verify(password, user.Password)) return null;
        return user;
    }

    public string GenerateToken(Users user)
    {
        var securityKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_conf["Jwt:Key"]));
        var credentials = new SigningCredentials(securityKey, SecurityAlgorithms.HmacSha256);
        var claims = new[]
        {
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Role, user.Isadmin.ToString() ?? "false")
        };
        var token = new JwtSecurityToken(_conf["Jwt:Issuer"],
            _conf["Jwt:Audience"],
            claims,
            expires: DateTime.Now.AddMinutes(15),
            signingCredentials: credentials);


        return new JwtSecurityTokenHandler().WriteToken(token);
    }
}