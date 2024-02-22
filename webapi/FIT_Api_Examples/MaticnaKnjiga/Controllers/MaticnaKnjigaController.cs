using FIT_Api_Examples.Data;
using FIT_Api_Examples.Helper;
using FIT_Api_Examples.Helper.AutentifikacijaAutorizacija;
using FIT_Api_Examples.MaticnaKnjiga.ViewModels;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Localization;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using System;
using System.Collections.Generic;
using System.Linq;


namespace FIT_Api_Examples.MaticnaKnjiga.Controllers
{
    //[Authorize]
    [ApiController]
    [Microsoft.AspNetCore.Mvc.Route("[controller]/[action]")]
    public class MaticnaKnjigaController : ControllerBase
    {
        private readonly ApplicationDbContext _dbContext;

        public MaticnaKnjigaController(ApplicationDbContext dbContext)
        {
            this._dbContext = dbContext;
        }

        public class MaticnaKnjigaVM
        {
            public int id { get; set; }
            public string ime { get; set; }
            public string prezime { get; set; }
            public List<UpisUAkGodinu> godinaStudija { get; set; }
            public List<CmbStavke> akGodina { get; set; }
        }

        [HttpGet]
        public ActionResult<MaticnaKnjigaVM> GetMaticna(int id)
        {
            Student student = _dbContext.Student.Find(id);
            if (student == null)
            {
                return BadRequest("Greska");
            }
            var maticna = new MaticnaKnjigaVM()
            {
                id = student.id,
                ime = student.ime,
                prezime = student.prezime,
                akGodina = _dbContext.AkademskaGodina.Select(x => new CmbStavke() { id = x.id, opis = x.opis }).ToList(),
                godinaStudija = _dbContext.UpisUAkGodinu.Include(x => x.student)
                                                       .Include(x => x.evidentiraoKorisnik)
                                                       .Include(x => x.akademskaGodina)
                                                       .ToList()

            };

            return Ok(maticna);
        }
        [HttpGet]
        public ActionResult GetGodine()
        {
            var akGodina = _dbContext.AkademskaGodina.Select(x => new CmbStavke() { id = x.id, opis = x.opis }).ToList();
            return Ok(akGodina);
        }

        public class ZimskiSemestar
        {
            public DateTime datum { get; set; }
            public int akGodina { get; set; }
            public int godinaStudija { get; set; }
            public bool obnova { get; set; }
            public float cijenaSkolarine { get; set; }
        }

        [HttpPost("{id}")]
        public ActionResult UpisiZimski(int id, [FromBody] ZimskiSemestar semestar)
        {
            Student student = _dbContext.Student.Find(id);
            if (student == null)
            {
                return BadRequest("Greska");
            }

            var novi = new UpisUAkGodinu();


                _dbContext.Add(novi);

                novi.studentId = student.id;
                novi.evidentiraoKorisnik = HttpContext.GetLoginInfo()?.korisnickiNalog;
                novi.evidentiraoKorisnikId = 1;
                novi.datum1_ZimskiUpis = semestar.datum;
                novi.akademskaGodinaId = semestar.akGodina;
                novi.godinaStudija = semestar.godinaStudija;
                novi.obnovaGodine = semestar.obnova;
                novi.cijenaSkolarine = semestar.cijenaSkolarine;

                _dbContext.SaveChanges();
                return Ok(novi);

           

        }
        [HttpPost("{id}")]
        public ActionResult OvjeriZimski(int id)
        {
            var godine = _dbContext.UpisUAkGodinu.Find(id);
            godine.datum2_ZimskiOvjera = DateTime.Now;

            _dbContext.SaveChanges();
            return Ok(godine);
        }


    }
}
