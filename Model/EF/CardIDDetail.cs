namespace Model.EF
{
    using System;
    using System.Collections.Generic;
    using System.ComponentModel.DataAnnotations;
    using System.ComponentModel.DataAnnotations.Schema;
    using System.Data.Entity.Spatial;

    [Table("CardIDDetail")]
    public partial class CardIDDetail
    {
        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2214:DoNotCallOverridableMethodsInConstructors")]
        public CardIDDetail()
        {
            Guests = new HashSet<Guest>();
        }

        [Key]
        [StringLength(50)]
        public string CardID { get; set; }

        [StringLength(250)]
        public string LocationGetCard { get; set; }

        public DateTime? DateGetCard { get; set; }

        [StringLength(250)]
        public string Household { get; set; }

        [System.Diagnostics.CodeAnalysis.SuppressMessage("Microsoft.Usage", "CA2227:CollectionPropertiesShouldBeReadOnly")]
        public virtual ICollection<Guest> Guests { get; set; }
    }
}
