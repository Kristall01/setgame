package set.network.packets.out;

import set.Player;

public class PacketOutSelflocate implements PacketOut {
	
	private int playerID;
	private boolean state;
	
	public PacketOutSelflocate(Player player) {
		playerID = player.getID();
		state = true;
	}
	
	@Override
	public String getType() {
		return "playerActiveState";
	}
}
