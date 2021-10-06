package set.network;

import com.google.gson.Gson;
import io.javalin.websocket.WsContext;
import set.network.packets.out.JsonPacket;
import set.network.packets.out.PacketOut;

public class JavalinWsConnection implements PlayerConnection {
	
	private WsContext context;
	private Gson gson = new Gson();
	
	public JavalinWsConnection(WsContext context) {
		this.context = context;
	}
	
	@Override
	public void sendPacket(PacketOut packet) {
		context.send(gson.toJson(new JsonPacket(packet)));
	}
	
	@Override
	public void disconnect() {
		context.session.close();
	}
}
