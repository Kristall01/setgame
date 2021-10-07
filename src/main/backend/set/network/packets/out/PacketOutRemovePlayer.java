package set.network.packets.out;

import set.Player;

public class PacketOutRemovePlayer implements PacketOut {
	
	private int playerID;
	
	public PacketOutRemovePlayer(Player player) {
		this.playerID = player.getID();
	}
	
	@Override
	public String getType() {
		return "removeplayer";
	}
}
