using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.EF
{
    public class DetailBill
    {
        public int? ID_Motel { get; set; }
        public string BillOfMonth { get; set; }
        public string NameRoom { get; set; }
        public string RepresentativeGuest { get; set; }
        public string TypeOfBill { get; set; }
        public int? TotalMoney { get; set; }
        public string CreatedDate { get; set; }
        public string PayDate { get; set; }
        public bool? Paid { get; set; }
    }
}
