using Back.Api.Models;
using Back.Application.Interface;
using Back.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Back.Application.Service;

public class UsersService : IUsersService
{
    private readonly AppDbContext _context;
    
    public UsersService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Users>> ListAsync() => await _context.Users.ToListAsync();
    
    public async Task<Users> FindAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user is null) return null;
        return user;
    }
    
    public async Task<Users?> Add(Users user)
    {
        user.Service = await _context.Service.FirstOrDefaultAsync(x => x.Id == user.ServiceId);
        var salt = BCrypt.Net.BCrypt.GenerateSalt();
        user.Password = BCrypt.Net.BCrypt.HashPassword(user.Password, salt);
        user.Id = _context.Users.Max(x => x.Id) + 1;
        var result = _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return result.Entity;
    }
}