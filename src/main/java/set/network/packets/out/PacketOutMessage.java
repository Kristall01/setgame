package set.network.packets.out;

public class PacketOutMessage implements PacketOut {
	
	private String text;
	
	public PacketOutMessage(String message) {
		this.text = message;
	}
	
	@Override
	public String getType() {
		return "message";
	}
}
