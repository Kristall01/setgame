package set.network;

import set.network.packets.out.PacketOut;

public interface PlayerConnection {
	
	void sendPacket(PacketOut packet);
	void disconnect();

}
