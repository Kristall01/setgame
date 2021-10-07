package set.commands;

import set.Player;

public class CommandBroadcast extends AbstractCommand {
	
	public CommandBroadcast() {
		super(true, "<üzenet>", "üzenet küldése");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		sender.getPlayerList().getGame().broadcastChatMessage(String.join(" ", arguments));
	}
	
}
