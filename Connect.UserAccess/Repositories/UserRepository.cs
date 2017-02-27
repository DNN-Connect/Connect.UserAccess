using Connect.DNN.PersonaBar.UserAccess.Models;
using DotNetNuke.Collections;
using DotNetNuke.Data;
using DotNetNuke.Framework;
using System;
using System.Linq;
using System.Collections.Generic;

namespace Connect.DNN.PersonaBar.UserAccess.Repositories
{
    public class UserRepository : ServiceLocator<IUserRepository, UserRepository>, IUserRepository
    {
        protected override Func<IUserRepository> GetFactory()
        {
            return () => new UserRepository();
        }
        public IPagedList<UserBase> SearchUsers(int portalId, string searchText, string orderByField, string sortOrder, int pageIndex, int pageSize)
        {
            using (var context = DataContext.Instance())
            {
                var repo = context.GetRepository<UserBase>();
                return repo.Find(pageIndex, pageSize, string.Format("WHERE PortalId = {0} AND (DisplayName LIKE '%{1}%' OR LastName LIKE '%{1}%' OR FirstName LIKE '%{1}%' OR Email LIKE '%{1}%') ORDER BY {2} {3}", portalId, searchText, orderByField, sortOrder));
            }
        }
        public User GetUser(int portalId, int userId)
        {
            var res = DotNetNuke.Entities.Users.UserController.GetUserById(portalId, userId);
            return new User(res);
        }
        public IEnumerable<UserRole> GetRoles(int portalId, int userId, int roleGroupId)
        {
            using (var context = DataContext.Instance())
            {
                var sql = "SELECT r.RoleName, r.RoleID, ISNULL(ur.Status, 0) Status";
                sql += " FROM {databaseOwner}{objectQualifier}Roles r";
                sql += " LEFT JOIN {databaseOwner}{objectQualifier}UserRoles ur ON r.RoleID = ur.RoleID AND ur.UserID = @1";
                sql += " WHERE r.PortalId = @0";
                if (roleGroupId > -2)
                {
                    if (roleGroupId > -1)
                    {
                        sql += " AND r.RoleGroupID = @2";
                    }
                    else
                    {
                        sql += " AND r.RoleGroupID IS NULL";
                    }
                }
                return context.ExecuteQuery<UserRole>(System.Data.CommandType.Text,
                    sql,
                    portalId,
                    userId,
                    roleGroupId);
            }
        }
        public void DeleteUserRole(int userId, int roleId)
        {
            using (var context = DataContext.Instance())
            {
                var sql = "DELETE FROM {databaseOwner}{objectQualifier}UserRoles WHERE UserId = @0 AND RoleId = @1";
                context.Execute(System.Data.CommandType.Text, sql, userId, roleId);
            }
        }
        public void SetUserRole(int userId, int roleId, int updatingUserId)
        {
            using (var context = DataContext.Instance())
            {
                var sql = "IF EXISTS (SELECT * FROM {databaseOwner}{objectQualifier}UserRoles WHERE UserId = @0 AND RoleId = @1)";
                sql += "  UPDATE {databaseOwner}{objectQualifier}UserRoles";
                sql += "  SET Status=1, ExpiryDate=NULL, IsTrialUsed=NULL, EffectiveDate=NULL,";
                sql += "  LastModifiedOnDate=GETDATE(), LastModifiedByUserID=@2";
                sql += "  WHERE UserId=@0 AND RoleId=@1";
                sql += " ELSE";
                sql += "  INSERT INTO {databaseOwner}{objectQualifier}UserRoles";
                sql += "  (UserID, RoleID, CreatedByUserID, CreatedOnDate, LastModifiedByUserID, LastModifiedOnDate)";
                sql += "  VALUES";
                sql += "  (@0, @1, @2, GETDATE(), @2, GETDATE())";
                context.Execute(System.Data.CommandType.Text, sql, userId, roleId, updatingUserId);
            }
        }
    }
    public partial interface IUserRepository
    {
        IPagedList<UserBase> SearchUsers(int portalId, string searchText, string orderByField, string sortOrder, int pageIndex, int pageSize);
        User GetUser(int portalId, int userId);
        IEnumerable<UserRole> GetRoles(int portalId, int userId, int roleGroupId);
        void DeleteUserRole(int userId, int roleId);
        void SetUserRole(int userId, int roleId, int updatingUserId);
    }
}