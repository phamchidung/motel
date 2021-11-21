using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.EF
{
    public class DetailContract
    {
        public string NameRoom { get; set; }
        public string RepresentativeName { get; set; }
        public string DateStart { get; set; }
        public string DateStop { get; set; }
        public int? Deposive { get; set; }
    }
}
