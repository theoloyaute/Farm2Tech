using Back.Api.Models;
using Back.Application.Interface.JwtService;
using Microsoft.AspNetCore.Mvc;

namespace Back.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthentificationController : ControllerBase
{
    private readonly IJwtService _jwtService;
    
    public AuthentificationController(IJwtService jwtService)
    {
        _jwtService = jwtService;
    }
    
    [HttpPost]
    public ActionResult Login([FromBody] Login model)
    {
        var user = _jwtService.Auth(model.Email.ToLower(), model.Password);
        if (user is null) return BadRequest("L'utilisateur n'existe pas !");
        if (!BCrypt.Net.BCrypt.Verify(model.Password, user.Password)) return BadRequest("Mot de passe incorect !");
        var token = _jwtService.GenerateToken();
        return Ok(new JsonResult(token));
    }
}