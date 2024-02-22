using FIT_Api_Examples.Data;
using System;
using System.ComponentModel.DataAnnotations;
using System.ComponentModel.DataAnnotations.Schema;

namespace FIT_Api_Examples.MaticnaKnjiga.ViewModels
{
    public class UpisUAkGodinu
    {
        [Key]
        public int id { get; set; }
        public DateTime? datum1_ZimskiUpis { get; set; }
        public DateTime? datum2_ZimskiOvjera { get; set; }
        public bool obnovaGodine { get; set; }
        public float? cijenaSkolarine { get; set; }
        public int godinaStudija { get; set; }

        [ForeignKey(nameof(student))]
        public int studentId { get; set; }
        public Student student { get; set; }

        [ForeignKey(nameof(akademskaGodina))]
        public int akademskaGodinaId { get; set; }
        public AkademskaGodina akademskaGodina { get; set; }

        [ForeignKey(nameof(evidentiraoKorisnik))]
        public int evidentiraoKorisnikId { get; set; }
        public KorisnickiNalog evidentiraoKorisnik { get; set; }
    }
}
