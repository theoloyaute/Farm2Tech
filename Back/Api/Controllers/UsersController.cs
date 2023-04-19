using Back.Api.Models;
using Back.Infrastructure.Context;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;

namespace Back.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly AppDbContext _context;
    
    public UsersController(AppDbContext context)
    {
        _context = context;
    }
    
    [HttpGet(Name = "GetUsersList")]
    public async Task<ActionResult<List<Users>>> GetUsersList() => await _context.Users.ToListAsync();
    
    [HttpGet("{id}", Name = "GetUserById")]
    public async Task<ActionResult<Users>> GetUserById(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return NotFound();
        return user;
    }
    
}