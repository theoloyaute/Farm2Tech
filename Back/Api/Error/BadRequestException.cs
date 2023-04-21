namespace Back.Api.Error;

public class BadRequestException : CustomException
{
    public BadRequestException(string message, params string[] arguments) : base(message, arguments)
    {
        StatusCode = 400;
    }
}