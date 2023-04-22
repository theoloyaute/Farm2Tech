using Back.Application.Interface;
using Back.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Back.Application.Service;

public class ServiceService : IServiceService
{
    private readonly AppDbContext _context;
    
    public ServiceService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Service>> ListAsync() => await _context.Service.ToListAsync();
    
    public async Task<Service> FindAsync(int id)
    {
        await _context.Service.Include(x => x.Site)
            .FirstOrDefaultAsync(x => x.Id == id);
        var service = await _context.Service.FindAsync(id);
        if (service is null) return null;
        return service;
    }
    
    public async Task<Service?> Add(Service entity)
    {
        entity.Id = _context.Service.Max(x => x.Id) + 1;
        var result = _context.Service.Add(entity);
        await _context.SaveChangesAsync();
        return result.Entity;
    }
    
    public async Task<Service?> Update(Service entity)
    {
        var service = await _context.Service.FindAsync(entity.Id);
        if (service is null) throw new NotFoundException("Service introuvable !");
        service.Name = entity.Name;
        _context.Service.Update(service);
        await _context.SaveChangesAsync();
        return service;
    }
    
    public void Delete(int id)
    {
        var service = _context.Service.FindAsync(id).Result;
        if (service is null) throw new NotFoundException("Service introuvable !");
        _context.Service.Remove(service);
        _context.SaveChanges();
    }
}