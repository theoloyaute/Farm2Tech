using System;
using System.Collections.Generic;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace Back.Api.Models;

[Table("users")]
public partial class Users
{
    [Key]
    [Column("id")]
    public int Id { get; set; }

    [Column("firstname")]
    [StringLength(255)]
    public string Firstname { get; set; } = null!;

    [Column("lastname")]
    [StringLength(255)]
    public string Lastname { get; set; } = null!;

    [Column("email")]
    [StringLength(255)]
    public string Email { get; set; } = null!;

    [Column("fix")]
    [StringLength(255)]
    public string? Fix { get; set; }

    [Column("mobile")]
    [StringLength(255)]
    public string Mobile { get; set; } = null!;

    [Column("password")]
    [StringLength(255)]
    public string Password { get; set; } = null!;

    [Column("isadmin")]
    public bool? Isadmin { get; set; }

    [Column("service_id")]
    public int? ServiceId { get; set; }

    [ForeignKey("ServiceId")]
    [InverseProperty("Users")]
    public virtual Service? Service { get; set; }
}

public partial class Login
{
    public string Email { get; set; }
    public string Password { get; set; }
}
