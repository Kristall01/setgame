package set.commands;

import set.Player;

public class CommandClearchat extends AbstractCommand {
	
	public CommandClearchat() {
		super(false, null, "csevegés törlése");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		sender.sendChatMessage("\0");
		sender.sendLogMessage("chat log törölve");
	}
}
