export * from './Branch';
export * from './FlowContext';
export * from './nodes';
export { triggers, getTriggersOptions } from './triggers';
export { useWorkflowVariableOptions } from './variable';

import { Plugin } from '@nocobase/client';
import React from 'react';
import { ExecutionPage } from './ExecutionPage';
import { WorkflowPage } from './WorkflowPage';
import { WorkflowPane, WorkflowProvider } from './WorkflowProvider';
import { DynamicExpression } from './components/DynamicExpression';
import { WorkflowTodo } from './nodes/manual/WorkflowTodo';
import { WorkflowTodoBlockInitializer } from './nodes/manual/WorkflowTodoBlockInitializer';
import { useTriggerWorkflowsActionProps } from './triggers/form';
import { NAMESPACE } from './locale';
import { getWorkflowDetailPath, getWorkflowExecutionsPath } from './constant';

export class WorkflowPlugin extends Plugin {
  async load() {
    this.addRoutes();
    this.addScopes();
    this.addComponents();
    this.app.addProvider(WorkflowProvider);
    this.app.settingsCenter.add(NAMESPACE, {
      icon: 'PartitionOutlined',
      title: `{{t("Workflow", { ns: "${NAMESPACE}" })}}`,
      Component: WorkflowPane,
      aclSnippet: 'pm.workflow.workflows',
    });
  }

  addScopes() {
    this.app.addScopes({
      useTriggerWorkflowsActionProps,
    });
  }

  addComponents() {
    this.app.addComponents({
      WorkflowPage,
      ExecutionPage,
      WorkflowTodo,
      WorkflowTodoBlockInitializer,
      DynamicExpression,
    });
  }

  addRoutes() {
    this.app.router.add('admin.workflow.workflows.id', {
      path: getWorkflowDetailPath(':id'),
      element: <WorkflowPage />,
    });
    this.app.router.add('admin.workflow.executions.id', {
      path: getWorkflowExecutionsPath(':id'),
      element: <ExecutionPage />,
    });
  }
}

export default WorkflowPlugin;
