using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace Back.Api.Models;

[Table("service")]
public partial class Service
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("name")]
    [StringLength(255)]
    public string Name { get; set; } = null!;

    [Column("site_id")]
    public int? SiteId { get; set; }

    [ForeignKey("SiteId")]
    [InverseProperty("Service")]
    public virtual Site? Site { get; set; }

    [InverseProperty("Service")]
    public virtual ICollection<Users> Users { get; set; } = new List<Users>();
}