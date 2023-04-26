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
        if (user is null) throw new BadRequestException("Email ou mot de passe incorrect !");
        var token = _jwtService.GenerateToken(user);
        return Ok(new JsonResult(token));
    }
}