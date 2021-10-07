package set.network.packets.out;

public class PacketOutResizeDeck implements PacketOut {
	
	private int count;
	
	public PacketOutResizeDeck(int count) {
		this.count = count;
	}
	
	@Override
	public String getType() {
		return "updatePakliSize";
	}
}
