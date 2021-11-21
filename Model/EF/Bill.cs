namespace Model.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Bill")]
    public partial class Bill
    {
        public int ID { get; set; }

        public DateTime? CreatedDate { get; set; }

        public DateTime? PayDate { get; set; }

        public bool? Paid { get; set; }

        public int? TotalMoney { get; set; }

        [StringLength(250)]
        public string Note { get; set; }

        public int? ID_Motel { get; set; }

        public int? MotelMoney { get; set; }

        public int? ElectricMoney { get; set; }

        public int? WaterMoney { get; set; }

        public int? SanitaryMoney { get; set; }

        public int? InternetMoney { get; set; }

        public int? OtherMoney { get; set; }

        [Column(TypeName = "date")]
        public DateTime? BillOfMonth { get; set; }

        public virtual MotelRoom MotelRoom { get; set; }
    }
}
