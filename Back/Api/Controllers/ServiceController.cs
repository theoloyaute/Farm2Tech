using Back.Api.Models;
using Back.Application.Interface;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Back.Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class ServiceController : ControllerBase
{
    private readonly IServiceService _service;
    
    public ServiceController(IServiceService service)
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
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Get(int id)
    {
        var result = await _service.FindAsync(id);
        return Ok(result);
    }
    
    [HttpPost]
    // [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Post([FromBody] Service service)
    {
        var result = await _service.Add(service);
        return Ok(result);
    }
    
    [HttpPut]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Put([FromBody] Service service)
    {
        var result = await _service.Update(service);
        return Ok(result);
    }
    
    [HttpDelete("{id:int}")]
    [Authorize(Roles = "Admin")]
    public IActionResult Delete(int id)
    {
        _service.Delete(id);
        return Ok();
    }
}