package set.network.packets.in;

import set.Game;
import set.Player;

public interface PacketIn {
	
	void doAction(Game game, Player player);
	
	/*private PlayerConnection sender;
	
	public PacketIn(PlayerConnection sender) {
		this.sender = sender;
	}
	
	public PlayerConnection getSender() {
		return sender;
	}
	*/
}
