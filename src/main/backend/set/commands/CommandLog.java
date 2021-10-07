package set.commands;

import set.Player;

public class CommandLog extends AbstractCommand {
	
	public CommandLog() {
		super(true, "<üzenet>", "log üzenet küldése");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		sender.getPlayerList().getGame().broadcastLogMessage(String.join(" ", arguments));
	}
	
}
