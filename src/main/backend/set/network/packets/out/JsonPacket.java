package set.network.packets.out;

public class JsonPacket {
	
	private String packetID;
	private PacketOut packetData;
	
	public JsonPacket(PacketOut packet) {
		this.packetID = packet.getType();
		this.packetData = packet;
	}
	
}
