using System.Security.Claims;
using Back.Api.Error;
using Back.Api.Models;
using Back.Application.Interface.JwtService;
using Microsoft.AspNetCore.Authorization;
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
        try
        {
            var user = _jwtService.Auth(model.Email.ToLower(), model.Password);
            var token = _jwtService.GenerateToken(user);
            if (user.Isadmin == false) return Unauthorized();
            return Ok(new JsonResult(token));
        }
        catch (UnauthorizedAccessException e)
        {
            return Unauthorized(new ApiResponse(401, e.Message));
        }
        catch (Exception e)
        {
            return BadRequest(new ApiResponse(400, e.Message));
        }
    }
}