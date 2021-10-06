package set.network.packets.in;

import set.Game;
import set.Player;

public class PakcetInCardAction implements PacketIn {
	
	private int cardID;
	
	@Override
	public void doAction(Game game, Player sender) {
		sender.cardInteract(game.getDeck().getCardByID(cardID));
	}
	
}
