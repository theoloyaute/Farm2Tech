namespace Back.Application.Interface;

public interface IServiceService
{
    Task<IEnumerable<Api.Models.Service>> ListAsync();
    Task<Api.Models.Service> FindAsync(int id);
    Task<Api.Models.Service?> Add(Api.Models.Service entity);
    Task<Api.Models.Service?> Update(Api.Models.Service entity);
    void Delete(int id);
}