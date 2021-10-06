package set.commands;

import set.Player;

import java.util.Arrays;

public class CommandSetscore extends AbstractCommand {
	
	public CommandSetscore() {
		super(true, "<pont> <név>", "játékos pontszám átállítása");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		if(arguments.length < 2) {
			sender.sendLogMessage("&cHiba:&r Túl kevés adatot adtál meg.");
			return;
		}
		int score = 0;
		try {
			score = Integer.parseInt(arguments[0]);
		}
		catch (NumberFormatException ex) {
			sender.sendLogMessage("&cHiba: '" + arguments[0] +"'&r nem egy szám.");
			return;
		}
		Player p = sender.getPlayerList().getPlayersByName(String.join(" ", Arrays.copyOfRange(arguments, 1, arguments.length)));
		if(p == null) {
			sender.sendLogMessage("&cHiba:&r Nincs ilyen nevű játékos.");
			return;
		}
		p.setScore(score);
	}
}
