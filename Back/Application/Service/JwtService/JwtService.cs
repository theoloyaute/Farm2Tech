using System.IdentityModel.Tokens.Jwt;
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
    
    public string GenerateToken()
    {
        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.ASCII.GetBytes(_conf["Jwt:Key"]);
        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Issuer = _conf["Jwt:Issuer"],
            Audience = _conf["Jwt:Audience"],
            Expires = DateTime.UtcNow.AddDays(7),
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };
        var token = tokenHandler.CreateToken(tokenDescriptor);
        return tokenHandler.WriteToken(token);
    }
}