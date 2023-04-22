using Back.Api.Error;
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
        await _context.Users.Include(x => x.Service).FirstOrDefaultAsync(x => x.Id == id);
        var user = await _context.Users.FindAsync(id);
        if (user is null) return null;
        return user;
    }
    
    public async Task<Users?> Add(Users entity)
    {
        entity.Service = await _context.Service.FirstOrDefaultAsync(x => x.Id == entity.ServiceId);
        entity.Id = _context.Users.Max(x => x.Id) + 1;
        var salt = BCrypt.Net.BCrypt.GenerateSalt();
        entity.Password = BCrypt.Net.BCrypt.HashPassword(entity.Password, salt);
        var result = _context.Users.Add(entity);
        await _context.SaveChangesAsync();
        return result.Entity;
    }

    public async Task<Users?> Update(Users entity)
    {
        var users = await _context.Users.FindAsync(entity.Id);
        if (users is null) throw new NotFoundException("Utilisateur introuvable !");
        users.Firstname = entity.Firstname;
        users.Lastname = entity.Lastname;
        users.Email = entity.Email;
        users.Fix = entity.Fix;
        users.Mobile = entity.Mobile;
        users.Password = entity.Password;
        users.Isadmin = entity.Isadmin;
        users.ServiceId = entity.ServiceId;
        _context.Users.Update(users);
        await _context.SaveChangesAsync();
        return users;
    }
    
    public void Delete(int id)
    {
        var user = _context.Users.FindAsync(id).Result;
        if (user is null) throw new NotFoundException("Utilisateur introuvable !");
        _context.Users.Remove(user);
        _context.SaveChanges();
    }
}