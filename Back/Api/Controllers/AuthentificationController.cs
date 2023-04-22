using System.Security.Claims;
using Back.Api.Error;
using Back.Api.Models;
using Back.Application.Interface.JwtService;
using Microsoft.AspNetCore.Mvc;

namespace Back.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthentificationController : ControllerBase
{
    private readonly IJwtService _jwtService;
    private readonly IConfiguration _conf;
    
    public AuthentificationController(IJwtService jwtService)
    {
        _jwtService = jwtService;
    }
    
    [HttpPost]
    public ActionResult Login([FromBody] Login model)
    {
        var user = _jwtService.Auth(model.Email.ToLower(), model.Password);
        if (user is null) throw new BadRequestException("Email incorrect !");
        if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password)) throw new BadRequestException("Mot de passe incorect !");
        var claims = new List<Claim>
        {
            new(ClaimTypes.Email, user.Email),
            new(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new(ClaimTypes.Role, user.Isadmin.ToString() ?? "false")
        };
        var token = _jwtService.GenerateToken(claims);
        return Ok(token);
    }
}