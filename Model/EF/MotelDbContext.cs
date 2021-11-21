using System;
using System.ComponentModel.DataAnnotations.Schema;
using System.Data.Entity;
using System.Linq;

namespace Model.EF
{
    public partial class MotelDbContext : DbContext
    {
        public MotelDbContext()
            : base("name=MotelDbContext")
        {
        }

        public virtual DbSet<Bill> Bills { get; set; }
        public virtual DbSet<CardIDDetail> CardIDDetails { get; set; }
        public virtual DbSet<Contract> Contracts { get; set; }
        public virtual DbSet<Device> Devices { get; set; }
        public virtual DbSet<Guest> Guests { get; set; }
        public virtual DbSet<MotelDevice> MotelDevices { get; set; }
        public virtual DbSet<MotelRoom> MotelRooms { get; set; }
        public virtual DbSet<Service> Services { get; set; }
        public virtual DbSet<User> Users { get; set; }

        protected override void OnModelCreating(DbModelBuilder modelBuilder)
        {
            modelBuilder.Entity<CardIDDetail>()
                .Property(e => e.CardID)
                .IsUnicode(false);

            modelBuilder.Entity<Device>()
                .HasMany(e => e.MotelDevices)
                .WithRequired(e => e.Device)
                .HasForeignKey(e => e.ID_Device)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<Guest>()
                .Property(e => e.Phone)
                .IsUnicode(false);

            modelBuilder.Entity<Guest>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<Guest>()
                .Property(e => e.CardID)
                .IsUnicode(false);

            modelBuilder.Entity<Guest>()
                .HasMany(e => e.Contracts)
                .WithOptional(e => e.Guest)
                .HasForeignKey(e => e.ID_Guest_Representative);

            modelBuilder.Entity<MotelRoom>()
                .Property(e => e.MetaTitle)
                .IsUnicode(false);

            modelBuilder.Entity<MotelRoom>()
                .HasMany(e => e.Bills)
                .WithOptional(e => e.MotelRoom)
                .HasForeignKey(e => e.ID_Motel);

            modelBuilder.Entity<MotelRoom>()
                .HasMany(e => e.Contracts)
                .WithOptional(e => e.MotelRoom)
                .HasForeignKey(e => e.ID_Motel);

            modelBuilder.Entity<MotelRoom>()
                .HasMany(e => e.Guests)
                .WithOptional(e => e.MotelRoom)
                .HasForeignKey(e => e.ID_Motel);

            modelBuilder.Entity<MotelRoom>()
                .HasMany(e => e.MotelDevices)
                .WithRequired(e => e.MotelRoom)
                .HasForeignKey(e => e.ID_Motel)
                .WillCascadeOnDelete(false);

            modelBuilder.Entity<MotelRoom>()
                .HasOptional(e => e.Service)
                .WithRequired(e => e.MotelRoom);

            modelBuilder.Entity<User>()
                .Property(e => e.UserName)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Password)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Email)
                .IsUnicode(false);

            modelBuilder.Entity<User>()
                .Property(e => e.Phone)
                .IsUnicode(false);
        }
    }
}
