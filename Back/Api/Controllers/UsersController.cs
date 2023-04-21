using Back.Api.Models;
using Back.Application.Interface;
using Microsoft.AspNetCore.Mvc;

namespace Back.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UsersController : ControllerBase
{
    private readonly IUsersService _service;
    
    public UsersController(IUsersService service)
    {
        _service = service;
    }

    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var result = await _service.ListAsync();
        return Ok(result);
    }
    
    [HttpGet("{id:int}")]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _service.FindAsync(id);
        return Ok(result);
    }
    
    [HttpPost]
    public async Task<IActionResult> Post([FromBody] Users user)
    {
        var result = await _service.Add(user);
        return Ok(result);
    }
    
    [HttpPut]
    public async Task<IActionResult> Put([FromBody] Users user)
    {
        var result = await _service.Update(user);
        return Ok(result);
    }
    
    [HttpDelete("{id:int}")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);
        return Ok();
    }
}