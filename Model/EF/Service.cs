namespace Model.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    public partial class Service
    {
        public int? ElectricNumber { get; set; }

        public int? WaterNumber { get; set; }

        [Key]
        [DatabaseGenerated(DatabaseGeneratedOption.None)]
        public int ID_Motel { get; set; }

        public DateTime? DateSave { get; set; }

        public virtual MotelRoom MotelRoom { get; set; }
    }
}
