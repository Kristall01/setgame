package set.network.packets.in;

import set.Game;
import set.Player;

public class PacketInPullcard implements PacketIn {
	
	@Override
	public void doAction(Game game, Player player) {
		if(!player.isAdmin()) {
			player.sendLogMessage("Nincs jogod ehhez a művelethez.");
			return;
		}
		game.pullCards(3);
	}
	
}
