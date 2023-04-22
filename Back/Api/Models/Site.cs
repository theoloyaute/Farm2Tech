using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Back.Api.Models;

[Table("site")]
public partial class Site
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("city")]
    [StringLength(100)]
    public string City { get; set; } = null!;

    [InverseProperty("Site")]
    public virtual ICollection<Service> Service { get; set; } = new List<Service>();
}
