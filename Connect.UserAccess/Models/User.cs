using System.Runtime.Serialization;

namespace Connect.DNN.PersonaBar.UserAccess.Models
{
    public class User : UserBase
    {
        [DataMember]
        public bool IsDeleted { get; set; }
        [DataMember]
        public bool UpdatePassword { get; set; }
        [DataMember]
        public bool Authorised { get; set; }
        [DataMember]
        public bool LockedOut { get; set; }

        public User(DotNetNuke.Entities.Users.UserInfo dnnUser)
        {
            Authorised = dnnUser.Membership.Approved;
            DisplayName = dnnUser.DisplayName;
            Email = dnnUser.Email;
            FirstName = dnnUser.FirstName;
            IsDeleted = dnnUser.IsDeleted;
            LastName = dnnUser.LastName;
            LockedOut = dnnUser.Membership.LockedOut;
            PortalId = dnnUser.PortalID;
            UpdatePassword = dnnUser.Membership.UpdatePassword;
            UserId = dnnUser.UserID;
            Username = dnnUser.Username;
        }
    }
}