package set.network.packets.in;

import set.CardSuppliers;
import set.Game;
import set.Player;

import java.util.Arrays;

public class PacketInMagic implements PacketIn {
	
	//values assigned from Gson reflection
	private String magic;
	private String command;
	
	public PacketInMagic() {}

	@Override
	public void doAction(Game game, Player player) {
		if(!player.isAdmin()) {
			player.sendLogMessage("Nincs jogod ehhez a művelethez.");
			return;
		}
		String[] split = command.split(" ");
		if(split[0].contentEquals("flash")) {
		
		}
		else if(split[0].contentEquals("text")) {
			game.broadcastLogMessage(String.join(" ",Arrays.copyOfRange(split, 1, split.length)));
		}
		else if(split[0].contentEquals("add")) {
			game.pullCards(3);
		}
		else if(split[0].contentEquals("reset")) {
			game.reset();
		}
		else if(split[0].contentEquals("addcard") && split[1].length() == 4) {
			game.getTable().putCard(game.getDeck().createCard(split[1]));
		}
		else if(split[0].contentEquals("addpattern")) {
			try {
				game.getDeck().addCards(CardSuppliers.byConfig(split[1]));
			}
			catch(Exception e) {
				player.sendLogMessage("invalid pattern:"+e.toString());
			}
		}
	}
}
