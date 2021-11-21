using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Motel_Ass.Areas.Admin.Controllers
{
    public class HomeController : BaseController
    {
        // GET: Admin/Home
        private MotelDbContext _context;
        public HomeController()
        {
            _context = new MotelDbContext();
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadDataMotel(int page, int pageSize = 5)
        {
            _context.Configuration.ProxyCreationEnabled = false;
            var listMotelRoom = _context.MotelRooms.OrderBy(x => x.Name).Skip((page - 1) * pageSize).Take(pageSize);
            int totalRow = _context.MotelRooms.Count();
            return Json(new
            {
                data = listMotelRoom,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult LoadDevicesOfMotel(int id)
        {
            _context.Configuration.ProxyCreationEnabled = false;
            var listDevices = from md in _context.MotelDevices.Where(x => x.ID_Motel == id)
                              join d in _context.Devices
                              on md.ID_Device equals d.ID
                              select new
                              {
                                  ID_Motel = id,
                                  ID_Device = d.ID,
                                  Name = d.Name,
                                  Unit = d.Unit,
                                  Price = d.Price,
                                  CompensationPrice = d.CompensationPrice,
                                  Quantity = md.Quantity,
                                  StatusDevice = md.StatusDevice,
                                  Guarantee = md.Guarantee
                              };

            return Json(new
            {
                data = listDevices,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }


        [HttpGet]
        public JsonResult GetDetailMotel(int id)
        {
            _context.Configuration.ProxyCreationEnabled = false;
            var motelRoom = _context.MotelRooms.Find(id);

            return Json(new
            {
                data = motelRoom,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult DeleteMotel(int id)
        {
            _context.Configuration.ProxyCreationEnabled = false;
            var entity = _context.MotelRooms.Find(id);
            _context.MotelRooms.Remove(entity);
            try
            {
                _context.SaveChanges();
                return Json(new
                {
                    status = true
                });
            }
            catch (Exception ex)
            {
                return Json(new
                {
                    status = false,
                    message = ex.Message
                });
            }
        }

        [HttpGet]
        public JsonResult loadDataDeviceNotInRoom(int id)
        {
            _context.Configuration.ProxyCreationEnabled = false;

            //select device not in room have id in parametor
            var listDevice = from d in _context.Devices
                             where
                             !(from md in _context.MotelDevices.Where(x => x.ID_Motel == id)
                               select md.ID_Device).Contains(d.ID)
                             select new
                             {
                                 Name = d.Name,
                                 ID = d.ID
                             };
            return Json(new
            {
                data = listDevice,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveRoom(string strMotelRoom)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            // conver from string to object
            MotelRoom motel = serializer.Deserialize<MotelRoom>(strMotelRoom);

            bool status = false;
            string message = string.Empty;

            // add motel room if id == 0
            if (motel.ID == 0)
            {
                motel.CreatedDate = DateTime.Now;
                motel.Status = false;
                _context.MotelRooms.Add(motel);
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
            // update motel roon if id != 0
            else
            {
                //save db
                var entity = _context.MotelRooms.Find(motel.ID);
                entity.Name = motel.Name;
                entity.MaxGuest = motel.MaxGuest;
                entity.Square = motel.Square;
                entity.Floor = motel.Floor;
                entity.Price = motel.Price;
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

        [HttpPost]
        public JsonResult saveMotelDevice(string strMotelDevice)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            // conver from string to object
            MotelDevice md = serializer.Deserialize<MotelDevice>(strMotelDevice);

            bool status = false;
            string message = string.Empty;

            md.DateAdd = DateTime.Now;
                _context.MotelDevices.Add(md);
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

            return Json(new
            {
                status = status,
                message = message
            });
        }
    }
}