package set.commands;

import set.Player;

public class CommandReset extends AbstractCommand {
	
	public CommandReset() {
		super(true, null, "játék újraindítása");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		sender.getPlayerList().getGame().reset();
	}
}
