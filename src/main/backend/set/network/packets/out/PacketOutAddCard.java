package set.network.packets.out;

import set.Card;

public class PacketOutAddCard implements PacketOut {
	
	private int cardID;
	private String params;
	
	public PacketOutAddCard(Card card) {
		this.cardID = card.getID();
		this.params = card.getParamLabel();
	}
	
	@Override
	public String getType() {
		return "putCard";
	}
}
