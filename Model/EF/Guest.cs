namespace Model.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("Guest")]
    public partial class Guest
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public Guest()
        {
            Contracts = new HashSet<Contract>();
        }

        public int ID { get; set; }

        [StringLength(250)]
        public string Name { get; set; }

        [StringLength(50)]
        public string Phone { get; set; }

        [StringLength(150)]
        public string Email { get; set; }

        public bool? Representative { get; set; }

        public DateTime? Dob { get; set; }

        [StringLength(250)]
        public string Job { get; set; }

        public bool? Gender { get; set; }

        [StringLength(250)]
        public string JobLocation { get; set; }

        public bool? Staying { get; set; }

        public int? ID_Motel { get; set; }

        [StringLength(50)]
        public string CardID { get; set; }

        [StringLength(250)]
        public string ReasonTemporaryResident { get; set; }

        public DateTime? TemporaryResidentFrom { get; set; }

        public DateTime? TemporaryResidentTo { get; set; }

        public virtual CardIDDetail CardIDDetail { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Contract> Contracts { get; set; }

        public virtual MotelRoom MotelRoom { get; set; }
    }
}
