namespace Back.Api.Error;

public class CustomException : Exception
{
    public readonly string CustomMessage;
    public int StatusCode = 500;
    
    public CustomException(string message, params string[] arguments) : base(message)
    {
        CustomMessage = message;
    }
}