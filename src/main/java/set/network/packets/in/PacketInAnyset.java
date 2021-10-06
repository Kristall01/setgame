package set.network.packets.in;

import set.Game;
import set.Player;

public class PacketInAnyset implements PacketIn {
	
	@Override
	public void doAction(Game game, Player player) {
		if(!player.isAdmin()) {
			player.sendLogMessage("Nincs jogod ehhez a művelethez.");
			return;
		}
		if(game.getTable().anySet()) {
			player.sendLogMessage("Van set az asztalon");
		}
		else {
			player.sendLogMessage("Nincs set az asztalon");
		}
	}
}
