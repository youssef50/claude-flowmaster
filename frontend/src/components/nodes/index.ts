import { SelectTeamNode } from './SelectTeamNode';
import { SelectEngineerNode } from './SelectEngineerNode';
import { ComposeMessageNode } from './ComposeMessageNode';
import { SendSlackMessageNode } from './SendSlackMessageNode';

export const nodeTypes = {
  selectTeam: SelectTeamNode,
  selectEngineer: SelectEngineerNode,
  composeMessage: ComposeMessageNode,
  sendSlackMessage: SendSlackMessageNode,
};
