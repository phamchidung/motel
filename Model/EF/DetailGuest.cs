using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.EF
{
    public class DetailGuest
    {
        public string CardID { get; set; }
        public string LocationGetCard { get; set; }
        public string DateGetCard { get; set; }
        public string Job { get; set; }
        public string Dob { get; set; }
        public string Email { get; set; }
        public string JobLocation { get; set; }
        public bool? Gender { get; set; }
    }
}
