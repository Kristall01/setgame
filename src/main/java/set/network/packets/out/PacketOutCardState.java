package set.network.packets.out;

import set.Card;

public class PacketOutCardState implements PacketOut {
	
	private int cardID;
	private boolean state;
	
	public PacketOutCardState(Card c, boolean state) {
		this.cardID = c.getID();
		this.state = state;
	}
	
	@Override
	public String getType() {
		return "cardActiveState";
	}
}
