package set.network.packets.out;

import set.Player;

public class PacketOutAddPlayer implements PacketOut {

	private String nickname;
	private int playerID;
	
	public PacketOutAddPlayer(Player player) {
		this.nickname = player.getName();
		this.playerID = player.getID();
	}
	
	@Override
	public String getType() {
		return "addPlayer";
	}
}
