using Model.EF;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace Model.Dao
{
    public class UserDAO
    {
        MotelDbContext db = null;

        public UserDAO()
        {
            db = new MotelDbContext();
        }
        public int Insert(User entity)
        {
            db.Users.Add(entity);
            db.SaveChanges();
            return entity.ID;
        }

        public User GetByUserName(string userName)
        {
            return db.Users.SingleOrDefault(x => x.UserName == userName);
        }
        public bool Login(string userName, string password)
        {
            var res = db.Users.Count(x => x.UserName == userName && x.Password == password);
            if (res > 0)
            {
                return true;
            }
            return false;
        }
    }
}
