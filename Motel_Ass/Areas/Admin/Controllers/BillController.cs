using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Motel_Ass.Areas.Admin.Controllers
{
    public class BillController : Controller
    {
        // GET: Admin/Bill
        private MotelDbContext _context;
        public BillController()
        {
            _context = new MotelDbContext();
        }
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult LoadDataBill(string dateSelect)
        {
            _context.Configuration.ProxyCreationEnabled = false;
            if (dateSelect == null)
            {
                dateSelect = DateTime.Now.ToString("MM/yyyy");
            }

            DateTime date = DateTime.Parse(dateSelect);

            //string strNow = now.ToString("MM/yyyy");
            var listBill = (from ct in _context.Contracts.Where(x => x.DateStop >= date)
                            join mr in _context.MotelRooms
                            on ct.ID_Motel equals mr.ID
                            join g in _context.Guests.Where(y => y.Representative == true)
                            on mr.ID equals g.ID_Motel
                            join b in _context.Bills.Where(z => z.BillOfMonth == date)
                            on mr.ID equals b.ID_Motel
                            into ps
                            from b in ps.DefaultIfEmpty()   //left join
                            select new DetailBill
                            {
                                ID_Motel = mr.ID,
                                BillOfMonth = dateSelect,
                                NameRoom = mr.Name,
                                RepresentativeGuest = g.Name,
                                TypeOfBill = ct.PaymentPeriod == 1 ? "Hằng tháng" : "Khác",
                                TotalMoney = b.TotalMoney.HasValue ? b.TotalMoney.Value : 0,
                                CreatedDate = b.CreatedDate.HasValue ? b.CreatedDate.Value.ToString() : "---",
                                PayDate = b.PayDate.HasValue ? b.PayDate.Value.ToString() : "---",
                                Paid = false
                            }).ToList();

            foreach (var item in listBill)
            {
                try
                {
                    item.CreatedDate = DateTime.Parse(item.CreatedDate).ToString("dd/MM/yyyy");
                }
                catch (Exception e)
                {

                }
                try
                {
                    item.PayDate = DateTime.Parse(item.PayDate).ToString("dd/MM/yyyy");
                }
                catch (Exception e)
                {

                }
            }
            return Json(new
            {
                data = listBill,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult LoadInforBill(string idMotel)
        {
            _context.Configuration.ProxyCreationEnabled = false;

            int id = int.Parse(idMotel);

            var inforBill = from mr in _context.MotelRooms
                            join sv in _context.Services
                            on mr.ID equals sv.ID_Motel
                            where mr.ID == id
                            select new
                            {
                                MotelPrice = mr.Price,
                                NumberElecttricBefore = sv.ElectricNumber,
                                NumberWaterBefore = sv.WaterNumber
                            };

            int countGuest = _context.Guests.Where(x => x.ID_Motel == id).Count();

            // convert to json
            var model = new JavaScriptSerializer().Serialize(inforBill);

            return Json(new
            {
                count = countGuest,
                data = model,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }
    }
}