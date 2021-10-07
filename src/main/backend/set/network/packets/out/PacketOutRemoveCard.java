package set.network.packets.out;

import set.Card;

public class PacketOutRemoveCard implements PacketOut {
	
	private int cardID;
	
	public PacketOutRemoveCard(Card card) {
		this.cardID = card.getID();
	}
	
	@Override
	public String getType() {
		return "removeCard";
	}
}
