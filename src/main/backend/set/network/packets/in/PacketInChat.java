package set.network.packets.in;

import set.Game;
import set.Player;

public class PacketInChat implements PacketIn {
	
	private String message;
	
	@Override
	public void doAction(Game game, Player player) {
		if(message.trim().length() == 0) {
			return;
		}
		if(message.startsWith("/")) {
			game.processCommand(player, message.substring(1).split(" "));
			//handle as command
		}
		else {
			message = "&7"+player.getName()+": &r"+message;
			if(player.isAdmin()) {
				message = "&c[Admin]&r "+message;
			}
			game.broadcastChatMessage(message);
		}
	}
	
}
