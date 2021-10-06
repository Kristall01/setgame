package set.network.packets.out;

import set.Player;

public class PacketOutUpdatescore implements PacketOut {
	
	private int playerID, score;
	
	public PacketOutUpdatescore(Player p) {
		playerID = p.getID();
		score = p.getScore();
	}
	
	@Override
	public String getType() {
		return "updateScore";
	}
}
