using Microsoft.AspNetCore.SignalR;
using System.Threading.Tasks;

namespace SignalRChat.Hubs
{
    public class ChatHub : Hub
    {
        public async Task SendMessage(string user, string message, string room, bool join)
        {
            if (join)
            {
                await JoinRoom(room).ConfigureAwait(false);
                await Clients.Group(room).SendAsync("ReceiveMessage", user, " joined to " + room, true).ConfigureAwait(true);   
            }
            else
            {
                await Clients.Group(room).SendAsync("ReceiveMessage", user, message, false).ConfigureAwait(true);
            }
        }

        public Task JoinRoom(string roomName)
        {
            return Groups.AddToGroupAsync(Context.ConnectionId, roomName);
        }
        public async Task LeaveChatRoom(string user, string room)
        {
            await Clients.Group(room).SendAsync("LeaveNotif", user, "left the room.", false).ConfigureAwait(true);
            await Groups.RemoveFromGroupAsync(Context.ConnectionId, room).ConfigureAwait(false);
        }
    }
}