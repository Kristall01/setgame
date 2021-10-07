package set.commands;

import set.Player;

public class CommandOp extends AbstractCommand {
	
	public CommandOp() {
		super(true,"<név>","admin jog megadása");
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
		p.setAdmin(true);
		sender.sendLogMessage("&a"+p.getName()+"&r ki lett nevezve adminná.");
	}
	
}
