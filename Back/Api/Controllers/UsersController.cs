using Back.Api.Models;
using Back.Application.Interface;
using Microsoft.AspNetCore.Authorization;
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
    [Authorize(Roles = "True")]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _service.FindAsync(id);
        return Ok(result);
    }
    
    [HttpPost]
    [Authorize(Roles = "True")]
    public async Task<IActionResult> Post([FromBody] Users user)
    {
        var result = await _service.Add(user);
        return Ok(result);
    }
    
    [HttpPut]
    [Authorize(Roles = "True")]
    public async Task<IActionResult> Put([FromBody] Users user)
    {
        var result = await _service.Update(user);
        return Ok(result);
    }
    
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "True")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);
        return Ok();
    }
    
    [HttpGet("{search}")]
    public async Task<IActionResult> Search(string search)
    {
        var result = await _service.FindBySearch(search);
        return Ok(result);
    }
}