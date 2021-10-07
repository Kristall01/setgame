package set.network.packets.out;

public class PacketOutDisconnected implements PacketOut {
	
	private String reason;
	
	public PacketOutDisconnected(String message) {
		this.reason = message;
	}
	
	@Override
	public String getType() {
		return "disconnected";
	}
}
