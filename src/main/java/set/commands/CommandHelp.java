package set.commands;

import set.Player;

import java.util.Map;

public class CommandHelp extends AbstractCommand {
	
	private Map<String, AbstractCommand> commandMap;
	
	public CommandHelp(Map<String, AbstractCommand> commandMap) {
		super(false, null, "segítség mutatása");
		this.commandMap = commandMap;
	}
	
	@Override
	protected void checkedExecute(Player sender, String[] arguments) {
		sender.sendChatMessage("elérhető parancsok:");
		if(sender.isAdmin()) {
			for(Map.Entry<String, AbstractCommand> entry : commandMap.entrySet()) {
				sender.sendChatMessage("&7-&r /"+entry.getKey()+"&7"+entry.getValue().getHelpEntry());
			}
		}
		else {
			for(Map.Entry<String, AbstractCommand> entry : commandMap.entrySet()) {
				if(!entry.getValue().needsPermission) {
					sender.sendChatMessage("&7-&r /"+entry.getKey()+"&7"+entry.getValue().getHelpEntry());
				}
			}
		}
	}
}
