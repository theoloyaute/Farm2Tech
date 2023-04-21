using Back.Api.Models;

namespace Back.Application.Interface;

public interface IUsersService
{
    Task<IEnumerable<Users>> ListAsync();
    Task<Users> FindAsync(int id);
    Task<Users?> Add(Users user);
}