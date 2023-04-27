namespace Back.Api.Error;

public class ApiResponse
{
    public int StatusCode { get; set; }
    public string? Message { get; set; }
    public object Data { get; set; }

    public ApiResponse(int statusCode, string message = null, object data = null)
    {
        StatusCode = statusCode;
        Message = message ?? GetDefaultMessageForStatusCode(statusCode);
        Data = data;
    }

    private static string? GetDefaultMessageForStatusCode(int statusCode)
    {
        return statusCode switch
        {
            400 => "Requête incorrecte",
            401 => "Non autorisé",
            404 => "Ressource non trouvée",
            500 => "Erreur interne du serveur",
            _ => null
        };
    }
}