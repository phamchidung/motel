namespace Model.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("MotelDevice")]
    public partial class MotelDevice
    {
        [Key]
        [Column(Order = 0)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ID_Motel { get; set; }

        [Key]
        [Column(Order = 1)]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ID_Device { get; set; }

        public DateTime? DateAdd { get; set; }

        public bool? Guarantee { get; set; }

        public int? Quantity { get; set; }

        [StringLength(250)]
        public string StatusDevice { get; set; }

        public virtual Device Device { get; set; }

        public virtual MotelRoom MotelRoom { get; set; }
    }
}
