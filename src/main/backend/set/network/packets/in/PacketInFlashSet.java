package set.network.packets.in;

import set.Card;
import set.Game;
import set.Player;

import java.util.List;
import java.util.Random;

public class PacketInFlashSet implements PacketIn {
	
	private static final Random random = new Random();
	
	@Override
	public void doAction(Game game, Player player) {
		if(!player.isAdmin()) {
			player.sendLogMessage("Nincs jogod ehhez a művelethez.");
			return;
		}
		List<List<Card>> possibleSets = game.getTable().getSetCombinations();
		if(possibleSets.size() == 0) {
			player.sendLogMessage("Nincs set a táblán.");
			return;
		}
		List<Card> randomSet = possibleSets.get(random.nextInt(possibleSets.size()));
		game.getEventManager().callEvent("flashcard", randomSet);
	}
	
}
