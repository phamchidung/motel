namespace Model.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Device")]
    public partial class Device
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Device()
        {
            MotelDevices = new HashSet<MotelDevice>();
        }

        public int ID { get; set; }

        [StringLength(250)]
        public string Name { get; set; }

        public int? Price { get; set; }

        [StringLength(250)]
        public string Unit { get; set; }

        public int? CompensationPrice { get; set; }

        [StringLength(250)]
        public string Note { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<MotelDevice> MotelDevices { get; set; }
    }
}
