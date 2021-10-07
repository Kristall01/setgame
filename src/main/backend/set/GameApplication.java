package set;

import com.google.gson.Gson;
import io.javalin.Javalin;
import io.javalin.http.staticfiles.Location;
import io.javalin.websocket.WsCloseContext;
import io.javalin.websocket.WsConnectContext;
import io.javalin.websocket.WsErrorContext;
import io.javalin.websocket.WsMessageContext;
import set.network.JavalinWsConnection;
import set.network.packets.in.*;

import java.io.File;
import java.nio.file.Files;
import java.nio.file.Path;
import java.util.Arrays;
import java.util.HashMap;

public class GameApplication {
	
	private Game game;
	private HashMap<String, Class<? extends PacketIn>> packetMap = new HashMap<>();
	
	public GameApplication(File assets, int port) {
		packetMap.put("cardaction", PakcetInCardAction.class);
		packetMap.put("magic", PacketInMagic.class);
		packetMap.put("anyset", PacketInAnyset.class);
		packetMap.put("getcard", PacketInPullcard.class);
		packetMap.put("resetgame", PacketInResetgame.class);
		packetMap.put("showset", PacketInFlashSet.class);
		packetMap.put("chat", PacketInChat.class);
		
		this.game = new Game();
		
		Javalin app = Javalin.create(config -> {
			if(assets != null) {
				config.addStaticFiles(assets.getAbsolutePath(), Location.EXTERNAL);
			}
			config.showJavalinBanner = false;
		});
		app.ws("/play/:name", wsHandler -> {
			wsHandler.onConnect(this::handleConnect);
			wsHandler.onMessage(this::handleMessage);
			wsHandler.onError(this::handleError);
			wsHandler.onClose(this::handleClose);
		});
		app.start(port);
	}
	
	private void handleConnect(WsConnectContext ctx) {
		ctx.session.setIdleTimeout(300000);
		JavalinWsConnection conn = new JavalinWsConnection(ctx);
		ctx.attribute("player", game.getPlayers().addPlayer(conn, ctx.pathParam("name")));
	}
	
	private void handleClose(WsCloseContext wsCloseContext) {
		game.getEventManager().callEvent("playerLeft", ((Player)wsCloseContext.attribute("player")));
	}
	
	private void handleError(WsErrorContext wsErrorContext) {
		((Player)wsErrorContext.attribute("player")).kick("connection error");
	}
	
	private void handleMessage(WsMessageContext wsMessageContext) {
		String message = wsMessageContext.message();
		int index = message.indexOf(';');
		String packetType = message.substring(0, index);
		String packetContext = message.substring(index+1);
		Class<?> packetClass = packetMap.get(packetType);
		Player player = wsMessageContext.attribute("player");
		if(packetClass == null) {
			player.kick("bad backet type: "+packetType);
			return;
		}
		PacketIn packet = null;
		try {
			packet = new Gson().<PacketIn>fromJson(packetContext, packetClass);
		}
		catch(Exception e) {
			System.out.println("packet in parse error");
			e.printStackTrace();
			return;
		}
		try {
			packet.doAction(game, player);
		}
		catch(Exception e) {
			System.out.println("unresolved exception");
			e.printStackTrace();
		}
	}
	
}
