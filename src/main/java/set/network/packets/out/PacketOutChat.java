package set.network.packets.out;

public class PacketOutChat implements PacketOut {
	
	private String message;
	
	public PacketOutChat(String message) {
		this.message = message;
	}
	
	@Override
	public String getType() {
		return "chat";
	}
}
