using Connect.DNN.PersonaBar.UserAccess.Repositories;
using Dnn.PersonaBar.Library;
using Dnn.PersonaBar.Library.Attributes;
using Connect.DNN.PersonaBar.UserAccess.Common;
using System.Net;
using System.Net.Http;
using System.Web.Http;
using DotNetNuke.Web.Api;
using DotNetNuke.Entities.Users;
using System;
using DotNetNuke.Services.Localization;
using DotNetNuke.Security.Roles;
using System.Collections.Generic;

namespace Connect.DNN.PersonaBar.UserAccess.Services
{
    [MenuPermission(MenuName = "Connect.UserAccess", Scope = ServiceScope.Admin)]
    public class UserAccessController : PersonaBarApiController
    {
        const string SharedResourceFileName = "DesktopModules/admin/Dnn.PersonaBar/Modules/Connect.UserAccess/App_LocalResources/UserAccess.resx";
        [HttpGet]
        public HttpResponseMessage Search(string searchText, string orderByField, string sortOrder, int pageIndex, int pageSize)
        {
            return Request.CreateResponse(HttpStatusCode.OK, UserRepository.Instance.SearchUsers(PortalId, searchText, orderByField, sortOrder, pageIndex, pageSize).Serialize());
        }
        [HttpGet]
        public HttpResponseMessage GetUser(int userId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, UserRepository.Instance.GetUser(PortalId, userId));
        }
        [HttpGet]
        public HttpResponseMessage Roles(int userId, int roleGroupId)
        {
            return Request.CreateResponse(HttpStatusCode.OK, UserRepository.Instance.GetRoles(PortalId, userId, roleGroupId));
        }
        public class SetUserRoleDTO
        {
            public int userId { get; set; }
            public int roleId { get; set; }
            public bool value { get; set; }
            public int roleGroupId { get; set; }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public HttpResponseMessage UserRole(SetUserRoleDTO data)
        {
            if (data.value)
            {
                UserRepository.Instance.SetUserRole(data.userId, data.roleId, UserInfo.UserID);
            }
            else
            {
                UserRepository.Instance.DeleteUserRole(data.userId, data.userId);
            }
            return Request.CreateResponse(HttpStatusCode.OK, UserRepository.Instance.GetRoles(PortalId, data.userId, data.roleGroupId));
        }
        public class SetPwDTO
        {
            public int userId { get; set; }
            public string npw { get; set; }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public HttpResponseMessage SetPw(SetPwDTO data)
        {
            UserInfo user = UserController.GetUserById(PortalId, data.userId);
            if (user == null)
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Localization.GetString("UserNotFound", SharedResourceFileName));
            try
            {
                if (!UserController.ResetAndChangePassword(user, data.npw))
                {
                    return Request.CreateResponse(HttpStatusCode.InternalServerError, Localization.GetString("CouldNotChangePassword", SharedResourceFileName));
                }
                else
                {
                    return Request.CreateResponse(HttpStatusCode.OK);
                }
            }
            catch (Exception ex)
            {
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Localization.GetString("CouldNotChangePassword", SharedResourceFileName));
            }
        }
        public class ResetPwDTO
        {
            public int userId { get; set; }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public HttpResponseMessage ResetPw(ResetPwDTO data)
        {
            UserInfo user = UserController.GetUserById(PortalId, data.userId);
            if (user == null)
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Localization.GetString("UserNotFound", SharedResourceFileName));
            UserController.ResetPasswordToken(user, true);
            return Request.CreateResponse(HttpStatusCode.OK);
        }
        public class UserPropertyDTO
        {
            public int userId { get; set; }
            public string propertyName { get; set; }
            public bool newValue { get; set; }
        }
        [HttpPost]
        [ValidateAntiForgeryToken]
        public HttpResponseMessage UserProperty(UserPropertyDTO data)
        {
            var user = UserController.GetUserById(PortalId, data.userId);
            if (user == null)
                return Request.CreateResponse(HttpStatusCode.InternalServerError, Localization.GetString("UserNotFound", SharedResourceFileName));
            switch (data.propertyName.ToLower())
            {
                case "authorised":
                    if (data.newValue)
                    {
                        UserController.ApproveUser(user);
                        user.Membership.Approved = true;
                        UserController.UpdateUser(PortalId, user);
                    }
                    else
                    {
                        user.Membership.Approved = false;
                        UserController.UpdateUser(PortalId, user);
                    }
                    break;
                case "lockedout":
                    UserController.UnLockUser(user);
                    break;
                case "isdeleted":
                    if (data.newValue)
                    {
                        UserController.DeleteUser(ref user, true, false);
                    }
                    else
                    {
                        UserController.RestoreUser(ref user);
                    }
                    break;
                case "updatepassword":
                    user.Membership.UpdatePassword = data.newValue;
                    DotNetNuke.Security.Membership.MembershipProvider.Instance().UpdateUser(user);
                    break;
            }
            return Request.CreateResponse(HttpStatusCode.OK, UserRepository.Instance.GetUser(PortalId, data.userId));
        }
        public class RoleGroupDTO
        {
            public int RoleGroupID { get; set; }
            public string RoleGroupName { get; set; }
        }
        [HttpGet]
        public HttpResponseMessage RoleGroups()
        {
            var res = new List<RoleGroupDTO>();
            foreach (RoleGroupInfo rg in RoleController.GetRoleGroups(PortalId))
            {
                res.Add(new RoleGroupDTO()
                {
                    RoleGroupID = rg.RoleGroupID,
                    RoleGroupName = rg.RoleGroupName
                });
            }
            return Request.CreateResponse(HttpStatusCode.OK, res);
        }
    }
}