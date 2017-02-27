using DotNetNuke.ComponentModel.DataAnnotations;
using System.Runtime.Serialization;

namespace Connect.DNN.PersonaBar.UserAccess.Models
{
    [TableName("vw_Users")]
    [DataContract]
    public class UserBase
    {
        [DataMember]
        public int UserId { get; set; }
        [DataMember]
        public int PortalId { get; set; }
        [DataMember]
        public string DisplayName { get; set; }
        [DataMember]
        public string Email { get; set; }
        [DataMember]
        public string Username { get; set; }
        [DataMember]
        public string FirstName { get; set; }
        [DataMember]
        public string LastName { get; set; }
    }
}