namespace Back.Application.Interface;

public interface IServiceService
{
    Task<IEnumerable<Service>> ListAsync();
    Task<Service> FindAsync(int id);
    Task<Service?> Add(Service entity);
    Task<Service?> Update(Service entity);
    void Delete(int id);
}