import { Injectable, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../../common/prisma/prisma.service';
import { SlackService } from '../slack/slack.service';
import { TeamsService } from '../teams/teams.service';
import { EngineersService } from '../engineers/engineers.service';

interface WorkflowNode {
  id: string;
  type: string;
  data: any;
  position: { x: number; y: number };
}

interface WorkflowEdge {
  id: string;
  source: string;
  target: string;
}

interface ExecutionContext {
  [key: string]: any;
}

@Injectable()
export class WorkflowExecutionService {
  constructor(
    private prisma: PrismaService,
    private slackService: SlackService,
    private teamsService: TeamsService,
    private engineersService: EngineersService,
  ) {}

  async executeWorkflow(workflowId: string, initialData: Record<string, any> = {}) {
    const workflow = await this.prisma.workflow.findUnique({
      where: { id: workflowId },
    });

    if (!workflow) {
      throw new BadRequestException('Workflow not found');
    }

    // Create workflow run
    const run = await this.prisma.workflowRun.create({
      data: {
        workflowId,
        status: 'running',
        logs: {},
      },
    });

    try {
      const nodes = workflow.nodes as unknown as WorkflowNode[];
      const edges = workflow.edges as unknown as WorkflowEdge[];

      // Build execution order using topological sort
      const executionOrder = this.topologicalSort(nodes, edges);

      // Execute nodes in order
      const context: ExecutionContext = { ...initialData };
      const logs: Record<string, any> = {};

      for (const nodeId of executionOrder) {
        const node = nodes.find((n) => n.id === nodeId);
        if (!node) continue;

        const nodeResult = await this.executeNode(node, context);
        logs[nodeId] = {
          type: node.type,
          input: { ...context },
          output: nodeResult,
          timestamp: new Date().toISOString(),
        };

        // Merge result into context
        Object.assign(context, nodeResult);
      }

      // Update run as successful
      await this.prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: 'success',
          finishedAt: new Date(),
          logs,
        },
      });

      return { runId: run.id, status: 'success', logs };
    } catch (error) {
      // Update run as failed
      await this.prisma.workflowRun.update({
        where: { id: run.id },
        data: {
          status: 'failed',
          finishedAt: new Date(),
          error: error.message,
        },
      });

      throw error;
    }
  }

  private async executeNode(node: WorkflowNode, context: ExecutionContext): Promise<any> {
    switch (node.type) {
      case 'selectTeam':
        return this.executeSelectTeam(node, context);
      case 'selectEngineer':
        return this.executeSelectEngineer(node, context);
      case 'composeMessage':
        return this.executeComposeMessage(node, context);
      case 'sendSlackMessage':
        return this.executeSendSlackMessage(node, context);
      default:
        throw new BadRequestException(`Unknown node type: ${node.type}`);
    }
  }

  private async executeSelectTeam(node: WorkflowNode, context: ExecutionContext) {
    const teamId = node.data.teamId;
    if (!teamId) {
      throw new BadRequestException('Team not selected in node configuration');
    }

    const team = await this.teamsService.findOne(teamId);
    return {
      selectedTeam: team,
      teamId: team.id,
      teamName: team.name,
    };
  }

  private async executeSelectEngineer(node: WorkflowNode, context: ExecutionContext) {
    const engineerId = node.data.engineerId;
    if (!engineerId) {
      throw new BadRequestException('Engineer not selected in node configuration');
    }

    const engineer = await this.engineersService.findOne(engineerId);
    return {
      selectedEngineer: engineer,
      engineerId: engineer.id,
      engineerName: engineer.name,
      engineerEmail: engineer.email,
      engineerSlackId: engineer.slackUserId,
    };
  }

  private async executeComposeMessage(node: WorkflowNode, context: ExecutionContext) {
    const template = node.data.messageTemplate || '';

    // Simple variable replacement: {{variableName}}
    let message = template;
    Object.keys(context).forEach((key) => {
      const regex = new RegExp(`{{${key}}}`, 'g');
      message = message.replace(regex, String(context[key]));
    });

    return {
      composedMessage: message,
    };
  }

  private async executeSendSlackMessage(node: WorkflowNode, context: ExecutionContext) {
    const message = context.composedMessage || node.data.message;
    const slackUserId = context.engineerSlackId || node.data.slackUserId;
    const channel = node.data.channel;

    if (!message) {
      throw new BadRequestException('No message to send');
    }

    let result;
    if (slackUserId) {
      result = await this.slackService.sendDirectMessage(slackUserId, message);
    } else if (channel) {
      result = await this.slackService.sendMessage(channel, message);
    } else {
      throw new BadRequestException('No recipient specified (slackUserId or channel)');
    }

    return {
      slackMessageSent: true,
      slackResponse: result,
    };
  }

  private topologicalSort(nodes: WorkflowNode[], edges: WorkflowEdge[]): string[] {
    const graph = new Map<string, string[]>();
    const inDegree = new Map<string, number>();

    // Initialize graph
    nodes.forEach((node) => {
      graph.set(node.id, []);
      inDegree.set(node.id, 0);
    });

    // Build adjacency list and in-degree map
    edges.forEach((edge) => {
      graph.get(edge.source)?.push(edge.target);
      inDegree.set(edge.target, (inDegree.get(edge.target) || 0) + 1);
    });

    // Find nodes with no incoming edges
    const queue: string[] = [];
    inDegree.forEach((degree, nodeId) => {
      if (degree === 0) {
        queue.push(nodeId);
      }
    });

    const result: string[] = [];

    while (queue.length > 0) {
      const current = queue.shift()!;
      result.push(current);

      graph.get(current)?.forEach((neighbor) => {
        const newDegree = (inDegree.get(neighbor) || 0) - 1;
        inDegree.set(neighbor, newDegree);

        if (newDegree === 0) {
          queue.push(neighbor);
        }
      });
    }

    if (result.length !== nodes.length) {
      throw new BadRequestException('Workflow contains cycles');
    }

    return result;
  }
}
