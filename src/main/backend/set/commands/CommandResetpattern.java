package set.commands;

import set.CardSuppliers;
import set.Player;

public class CommandResetpattern extends AbstractCommand {
	
	public CommandResetpattern() {
		super(true, "<pattern>", "játék újraindítása a megadott kezdőpaklival");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		if(arguments.length == 0) {
			sender.sendLogMessage("&cHiba:&r túl kevés adat.");
			return;
		}
		String pattern = "[0-2]{4}";
		if(!arguments[0].matches(pattern)) {
			sender.sendLogMessage("&cHiba:&r A megadott paraméternek meg kell felelnie a következő regex pattern-nek:");
			sender.sendLogMessage(pattern);
			return;
		}
		Iterable<String> supplier = CardSuppliers.byConfig(arguments[0]);
		sender.getPlayerList().getGame().resetBySupplier(supplier);
	}
}
