namespace Model.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Contract")]
    public partial class Contract
    {
        public int ID { get; set; }

        public int? ID_Motel { get; set; }

        public int? ID_Guest_Representative { get; set; }

        public int? Deposive { get; set; }

        public DateTime? DateStart { get; set; }

        public DateTime? DateStop { get; set; }

        public int? PaymentPeriod { get; set; }

        public int? DatePayNextPeriod { get; set; }

        public virtual Guest Guest { get; set; }

        public virtual MotelRoom MotelRoom { get; set; }
    }
}
