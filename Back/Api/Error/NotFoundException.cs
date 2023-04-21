namespace Back.Api.Error;

public class NotFoundException : CustomException
{
    public NotFoundException(string message, params string[] arguments) : base(message, arguments)
    {
        StatusCode = 404;
    }
}