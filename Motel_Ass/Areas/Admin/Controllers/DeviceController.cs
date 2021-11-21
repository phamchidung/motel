using Model.EF;
using System;
using System.Linq;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Motel_Ass.Areas.Admin.Controllers
{
    public class DeviceController : BaseController
    {
        // GET: Admin/Device
        private MotelDbContext _context;
        public DeviceController()
        {
            _context = new MotelDbContext();
        }
        public ActionResult Index()
        {
            return View();
        }

        [HttpGet]
        public JsonResult LoadDataDevice()
        {
            _context.Configuration.ProxyCreationEnabled = false;
            var listDevices = from d in _context.Devices

                                  // group by id_device and count id_device
                              join md in _context.MotelDevices.GroupBy(x => x.ID_Device).Select(y => new
                              {
                                  Id = y.Key,
                                  TotalQuantity = y.Sum(x => x.Quantity)
                              })

                              on d.ID equals md.Id
                              // left join here
                              into sr
                              from x in sr.DefaultIfEmpty()
                              select new
                              {
                                  Name = d.Name,
                                  Unit = d.Unit,
                                  Price = d.Price,
                                  CompensationPrice = d.CompensationPrice,
                                  TotalQuantity = x.TotalQuantity.HasValue ? x.TotalQuantity.Value : 0
                              };
            return Json(new
            {
                data = listDevices,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveDevice(string strDevice)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            // conver from string to object
            Device device = serializer.Deserialize<Device>(strDevice);

            bool status = false;
            string message = string.Empty;

            // add motel room if id == 0
            if (device.ID == 0)
            {
                _context.Devices.Add(device);
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
                var entity = _context.Devices.Find(device.ID);
                entity.Name = device.Name;
                entity.Price = device.Price;
                entity.Unit = device.Unit;
                entity.CompensationPrice = device.CompensationPrice;
                entity.Note = device.Note;
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