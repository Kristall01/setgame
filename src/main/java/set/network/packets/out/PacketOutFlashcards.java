package set.network.packets.out;

import set.Card;

import java.util.ArrayList;
import java.util.List;

public class PacketOutFlashcards implements PacketOut {
	
	private List<Integer> cardIds = new ArrayList<>();
	
	public PacketOutFlashcards(List<Card> cards) {
		for (Card card : cards) {
			cardIds.add(card.getID());
		}
	}
	
	@Override
	public String getType() {
		return "flashCards";
	}
}
