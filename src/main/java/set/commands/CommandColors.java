package set.commands;

import set.Player;

public class CommandColors extends AbstractCommand {
	
	public CommandColors() {
		super(false, null, "színek lekérdezése");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		char[] chars = "0123456789abcdeflmno".toCharArray();
		StringBuilder b = new StringBuilder();
		for (char c : chars) {
			b.append("&").append(c).append("&&").append(c).append("&r ");
		}
		sender.sendChatMessage(b.toString());
	}
}
