using Back.Api.Error;
using Back.Api.Models;
using Back.Infrastructure.Context;
using Microsoft.EntityFrameworkCore;

namespace Back.Application.Service;

public class SiteService
{
    private readonly AppDbContext _context;
    
    public SiteService(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<Site>> ListAsync() => await _context.Site.ToListAsync();
    
    public async Task<Site> FindAsync(int id)
    {
        await _context.Site.Include(x => x.Service)
            .FirstOrDefaultAsync(x => x.Id == id);
        var site = await _context.Site.FindAsync(id);
        if (site is null) return null;
        return site;
    }
    
    public async Task<Site?> Add(Site entity)
    {
        entity.Id = _context.Site.Max(x => x.Id) + 1;
        var result = _context.Site.Add(entity);
        await _context.SaveChangesAsync();
        return result.Entity;
    }
    
    public async Task<Site?> Update(Site entity)
    {
        var site = await _context.Site.FindAsync(entity.Id);
        if (site is null) throw new NotFoundException("Site introuvable !");
        site.City = entity.City;
        _context.Site.Update(site);
        await _context.SaveChangesAsync();
        return site;
    }
    
    public void Delete(int id)
    {
        var site = _context.Site.FindAsync(id).Result;
        if (site is null) throw new NotFoundException("Site introuvable !");
        _context.Site.Remove(site);
        _context.SaveChanges();
    }
}