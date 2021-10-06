package set.commands;

import set.Player;

public class CommandDeop extends AbstractCommand {
	
	public CommandDeop() {
		super(true, "<név>", "admin jog elvétele");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		if(arguments.length == 0) {
			sender.sendLogMessage("&cHiba:&r Túl kevés adatot adtál meg.");
			return;
		}
		Player p = sender.getPlayerList().getPlayersByName(String.join(" ", arguments));
		if(p == null) {
			sender.sendLogMessage("&cHiba:&r Nincs ilyen nevű játékos.");
			return;
		}
		p.setAdmin(false);
		sender.sendLogMessage("&a"+p.getName()+"&r le lett fokozva.");
	}
	
}
