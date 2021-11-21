using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Web;
using System.Web.Mvc;
using System.Web.Script.Serialization;

namespace Motel_Ass.Areas.Admin.Controllers
{
    public class ContractController : BaseController
    {
        // GET: Admin/Contract
        private MotelDbContext _context;
        public ContractController()
        {
            _context = new MotelDbContext();
        }
        public ActionResult Index()
        {
            return View();
        }
        [HttpGet]
        public JsonResult LoadDataContract(int page, int pageSize = 5)
        {
            _context.Configuration.ProxyCreationEnabled = false;
            int totalRow = _context.Contracts.Count();
            var listContract = (from mr in _context.MotelRooms

                                    // group by id_device and count id_device
                                join ct in _context.Contracts
                                on mr.ID equals ct.ID_Motel
                                join g in _context.Guests
                                on ct.ID_Guest_Representative equals g.ID
                                select new DetailContract
                                {
                                    NameRoom = mr.Name,
                                    RepresentativeName = g.Name,
                                    DateStart = ct.DateStart.HasValue ? ct.DateStart.Value.ToString() : "---",
                                    DateStop = ct.DateStop.HasValue ? ct.DateStop.Value.ToString() : "---",
                                    Deposive = ct.Deposive
                                }).OrderBy(x => x.DateStart).Skip((page - 1) * pageSize).Take(pageSize).ToList();
            foreach (var item in listContract)
            {
                try
                {
                    item.DateStart = DateTime.Parse(item.DateStart).ToString("dd/MM/yyyy");
                }
                catch (Exception e)
                {

                }
                try
                {
                    item.DateStop = DateTime.Parse(item.DateStop).ToString("dd/MM/yyyy");
                }
                catch (Exception e)
                {

                }
            }
            return Json(new
            {
                data = listContract,
                total = totalRow,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        // select guest not staying 
        [HttpGet]
        public JsonResult LoadDataGuest()
        {
            _context.Configuration.ProxyCreationEnabled = false;

            var listGuest = _context.Guests.Where(x => x.Staying == false).ToList();
            return Json(new
            {
                data = listGuest,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpGet]
        public JsonResult ClearSession()
        {
            _context.Configuration.ProxyCreationEnabled = false;
            Session.Remove("GuessSelected");
            return Json(new
            {
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        // selected guest
        [HttpGet]
        public JsonResult loadDataGuestSelected(int idGuest, int idRoom)
        {
            _context.Configuration.ProxyCreationEnabled = false;

            var room = _context.MotelRooms.Find(idRoom);

            // still not select guest
            if (Session["GuessSelected"] == null)
            {
                Session["GuessSelected"] = _context.Guests.Where(x => x.ID == idGuest).ToList();
            }
            // select guest already
            else
            {
                //check duplicate guest select
                List<Guest> listCheckGuest = (List<Guest>)Session["GuessSelected"];
                foreach (var item in listCheckGuest)
                {
                    if (item.ID == idGuest)
                    {
                        return Json(new
                        {
                            data = (List<Guest>)Session["GuessSelected"],
                            message = "Đã chọn người này rồi!",
                            status = true
                        }, JsonRequestBehavior.AllowGet);
                    }
                }

                // can not select guest more than max guest of room
                if (((List<Guest>)Session["GuessSelected"]).Count >= room.MaxGuest)
                {
                    return Json(new
                    {
                        data = (List<Guest>)Session["GuessSelected"],
                        message = "Không thể thêm quá số người của phòng!",
                        status = true
                    }, JsonRequestBehavior.AllowGet);
                }

                // add guest to session
                var listGuestTemp = _context.Guests.Where(x => x.ID == idGuest).ToList();
                ((List<Guest>)Session["GuessSelected"]).AddRange(listGuestTemp);
            }

            var listRes = (List<Guest>)Session["GuessSelected"];

            return Json(new
            {
                data = listRes,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        // selected guest
        [HttpGet]
        public JsonResult removeGuest(int idGuest)
        {
            _context.Configuration.ProxyCreationEnabled = false;

            List<Guest> listTemp = (List<Guest>)Session["GuessSelected"];

            Guest guest = null;

            foreach (var item in listTemp)
            {
                if (item.ID == idGuest)
                {
                    guest = item;
                    break;
                }
            }
            List<Guest> listRes = null;

            if (guest != null)
            {
                listRes = (List<Guest>)Session["GuessSelected"];
                listRes.Remove(guest);
                Session["GuessSelected"] = listRes;
            }

            return Json(new
            {
                data = (List<Guest>)Session["GuessSelected"],
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        public JsonResult loadDataNameRoom()
        {
            _context.Configuration.ProxyCreationEnabled = false;
            var listRooms = _context.MotelRooms.Where(x => x.Status == false).ToList();

            foreach (var item in listRooms)
            {
                item.Name = item.Name + " - Giá: " + item.Price;
            }

            return Json(new
            {
                data = listRooms,
                status = true
            }, JsonRequestBehavior.AllowGet);
        }

        [HttpPost]
        public JsonResult SaveContract(string strContract)
        {
            JavaScriptSerializer serializer = new JavaScriptSerializer();

            // conver from string to object
            Contract contract = serializer.Deserialize<Contract>(strContract);

            bool status = false;
            string message = string.Empty;

            // add contract  if id == 0
            if (contract.ID == 0)
            {
                try
                {
                    // get representative guest
                    var representor = _context.Guests.Find(contract.ID_Guest_Representative);

                    // get room selected
                    var motel = _context.MotelRooms.Find(contract.ID_Motel);

                    //get list guests want to join the room
                    List<Guest> listGuest = (List<Guest>)Session["GuessSelected"];

                    //set room for guest
                    foreach (var item in listGuest)
                    {
                        var guest = _context.Guests.Find(item.ID);
                        guest.ID_Motel = motel.ID;
                        _context.SaveChanges();
                    }

                    //set representative for guest
                    representor.Representative = true;

                    //set status for room become true
                    motel.Status = true;

                    _context.Contracts.Add(contract);

                    // add room to bill
                    //Bill bill = new Bill()
                    //{
                    //    ID_Motel = contract.ID_Motel
                    //};
                    //_context.Bills.Add(bill);

                    _context.SaveChanges();
                    status = true;
                }

                catch (Exception ex)
                {
                    status = false;
                    message = ex.Message;
                }
            }
            // update contract if id != 0
            else
            {
                //save db
                var entity = _context.Contracts.Find(contract.ID);
                entity.ID_Motel = contract.ID_Motel;
                entity.ID_Guest_Representative = contract.ID_Guest_Representative;
                entity.Deposive = contract.Deposive;
                entity.DateStart = contract.DateStart;
                entity.DateStop = contract.DateStop;
                entity.PaymentPeriod = contract.PaymentPeriod;
                entity.DatePayNextPeriod = contract.DatePayNextPeriod;
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

            Session.Remove("GuessSelected");

            return Json(new
            {
                status = status,
                message = message
            });
        }
    }
}