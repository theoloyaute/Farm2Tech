using Back.Api.Models;

namespace Back.Application.Interface;

public interface ISiteService
{
    Task<IEnumerable<Site>> ListAsync();
    Task<Site> FindAsync(int id);
    Task<Site?> Add(Site entity);
    Task<Site?> Update(Site entity);
    void Delete(int id);
}