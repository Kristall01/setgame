package set.commands;

import set.Player;

public class CommandAdmin extends AbstractCommand{
	
	public CommandAdmin() {
		super(false, "<kód>", "admin szerep bekapcsolása");
	}
	
	@Override
	protected void checkedExecute(Player player, String[] arguments) {
		if(arguments.length == 0) {
			player.sendLogMessage("Túl kevés adat");
			return;
		}
		if(player.isAdmin()) {
			if(arguments[0].equals("off")) {
				player.setAdmin(false);
				player.sendLogMessage("Admin mód kikapcsolva");
				
			}
			else {
				player.sendLogMessage("Már admin vagy!");
			}
			return;
		}
		if(arguments[0].equals("banán")) {
			player.setAdmin(true);
			player.sendLogMessage("Admin mód bekapcsolva.");
		}
		else {
			player.sendLogMessage("Hibás kód.");
		}
	}
}
