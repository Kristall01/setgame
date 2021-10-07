package set.commands;

import set.Player;

public class CommandKick extends AbstractCommand {
	
	public CommandKick() {
		super(true, "<név>", "játékos kirúgása");
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		Player p = sender.getPlayerList().getPlayersByName(String.join(" ", arguments));
		if(p == null) {
			sender.sendLogMessage("&cHiba:&r Nincs ilyen nevű játékos.");
			return;
		}
		if(p.isAdmin()) {
			sender.sendLogMessage("&cHiba:&r Admin játékost nem lehet kirúgni.");
			return;
		}
		sender.sendLogMessage("&a"+p.getName()+"&r ki lett rúgva.");
		p.kick();
	}
}
