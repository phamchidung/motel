using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Motel_Ass.Areas.Admin.Controllers
{
    public class GuestController : BaseController
    {
        private MotelDbContext _context;
        public GuestController()
        {
            _context = new MotelDbContext();
        }
        // GET: Admin/Guest
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult LoadDataGuest(int page, int pageSize = 5)
        {
            _context.Configuration.ProxyCreationEnabled = false;
            int totalRow = _context.Guests.Count();
            var listGuest = (from g in _context.Guests.DefaultIfEmpty()

                                // group by id_device and count id_device
                            join m in _context.MotelRooms
                            on g.ID_Motel equals m.ID
                            into id
                            from motelName in id.DefaultIfEmpty()
                            select new
                            {
                                ID = g.ID,
                                Name = g.Name,
                                Phone = g.Phone,
                                Staying = g.Staying,
                                MotelRoom = motelName.Name,
                                Representative = g.Representative
                            }).OrderBy(x=>x.Name).Skip((page - 1) * pageSize).Take(pageSize).ToList();
            return Json(new
            {
                data = listGuest,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
        [HttpGet]
        public JsonResult LoadDetailGuest(int id)
        {
            _context.Configuration.ProxyCreationEnabled = false;
            var listGuest = (from g in _context.Guests.Where(x => x.ID == id)
                             join c in _context.CardIDDetails
                             on g.CardID equals c.CardID
                             select new DetailGuest
                             {
                                 Gender = g.Gender,
                                 CardID = g.CardID,
                                 LocationGetCard = c.LocationGetCard,
                                 DateGetCard = c.DateGetCard.HasValue? c.DateGetCard.Value.ToString():string.Empty,
                                 Job = g.Job,
                                 Dob = g.Dob.HasValue ? g.Dob.Value.ToString() : string.Empty,
                                 Email = g.Email,
                                 JobLocation = g.JobLocation
                             }).ToList();

            //format value of date
            foreach(var item in listGuest)
            {
                try
                {
                    item.DateGetCard = DateTime.Parse(item.DateGetCard).ToString("dd/MM/yyyy");
                } catch(Exception e)
                {
                    item.DateGetCard = "---";
                }
                try
                {
                    item.Dob = DateTime.Parse(item.Dob).ToString("dd/MM/yyyy");
                }
                catch (Exception ex)
                {
                    item.Dob = "---";
                }
            }
            return Json(new
            {
                data = listGuest,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveGuest(string strGuest, string strCardIDDetail)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            // conver from string to object
            Guest guest = serializer.Deserialize<Guest>(strGuest);
            CardIDDetail cardIdDetail = serializer.Deserialize<CardIDDetail>(strCardIDDetail);

            bool status = false;
            string message = string.Empty;

            // add guest if id == 0
            if (guest.ID == 0)
            {
                // add card id detail first
                _context.CardIDDetails.Add(cardIdDetail);

                //add guest before
                _context.Guests.Add(guest);

                try
                {
                    _context.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }
            // update guest if id != 0
            else
            {
                //save db
                var entityCardId = _context.CardIDDetails.Find(cardIdDetail.CardID);
                var entityGuest = _context.Guests.Find(guest.ID);

                // update card id infor first
                entityCardId.CardID = cardIdDetail.CardID;
                entityCardId.LocationGetCard = cardIdDetail.LocationGetCard;
                entityCardId.DateGetCard = cardIdDetail.DateGetCard;
                entityCardId.Household = cardIdDetail.Household;

                // update guest infor
                entityGuest.ID = guest.ID;
                entityGuest.Name = guest.Name;
                entityGuest.Phone = guest.Phone;
                entityGuest.Email = guest.Email;
                entityGuest.Representative = guest.Representative;
                entityGuest.Dob = guest.Dob;
                entityGuest.Job = guest.Job;
                entityGuest.Gender = guest.Gender;
                entityGuest.JobLocation = guest.JobLocation;
                entityGuest.Staying = guest.Staying;
                entityGuest.CardID = guest.CardID;
                entityGuest.ReasonTemporaryResident = guest.ReasonTemporaryResident;
                entityGuest.TemporaryResidentFrom = guest.TemporaryResidentFrom;
                entityGuest.TemporaryResidentTo = guest.TemporaryResidentTo;

                try
                {
                    _context.SaveChanges();
                    status = true;
                }
                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }

            return Json(new
            {
                status = status,
                message = message
            });
        }
    }
}