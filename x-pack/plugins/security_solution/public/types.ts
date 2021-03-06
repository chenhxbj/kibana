/*
 * Copyright Elasticsearch B.V. and/or licensed to Elasticsearch B.V. under one
 * or more contributor license agreements. Licensed under the Elastic License;
 * you may not use this file except in compliance with the Elastic License.
 */

import { AppFrontendLibs } from './common/lib/lib';
import { CoreStart } from '../../../../src/core/public';
import { HomePublicPluginSetup } from '../../../../src/plugins/home/public';
import { DataPublicPluginStart } from '../../../../src/plugins/data/public';
import { EmbeddableStart } from '../../../../src/plugins/embeddable/public';
import { NewsfeedPublicPluginStart } from '../../../../src/plugins/newsfeed/public';
import { Start as InspectorStart } from '../../../../src/plugins/inspector/public';
import { UiActionsStart } from '../../../../src/plugins/ui_actions/public';
import { UsageCollectionSetup } from '../../../../src/plugins/usage_collection/public';
import { TelemetryManagementSectionPluginSetup } from '../../../../src/plugins/telemetry_management_section/public';
import { Storage } from '../../../../src/plugins/kibana_utils/public';
import { IngestManagerStart } from '../../fleet/public';
import { PluginStart as ListsPluginStart } from '../../lists/public';
import {
  TriggersAndActionsUIPublicPluginSetup as TriggersActionsSetup,
  TriggersAndActionsUIPublicPluginStart as TriggersActionsStart,
} from '../../triggers_actions_ui/public';
import { SecurityPluginSetup } from '../../security/public';
import { ResolverPluginSetup } from './resolver/types';
import { Inspect } from '../common/search_strategy';
import { MlPluginSetup, MlPluginStart } from '../../ml/public';

import { Detections } from './detections';
import { Cases } from './cases';
import { Hosts } from './hosts';
import { Network } from './network';
import { Overview } from './overview';
import { Timelines } from './timelines';
import { Management } from './management';
import { LicensingPluginStart } from '../../licensing/public';

export interface SetupPlugins {
  home?: HomePublicPluginSetup;
  security: SecurityPluginSetup;
  triggersActionsUi: TriggersActionsSetup;
  usageCollection?: UsageCollectionSetup;
  telemetryManagementSection?: TelemetryManagementSectionPluginSetup;
  ml?: MlPluginSetup;
}

export interface StartPlugins {
  data: DataPublicPluginStart;
  embeddable: EmbeddableStart;
  inspector: InspectorStart;
  ingestManager?: IngestManagerStart;
  lists?: ListsPluginStart;
  licensing: LicensingPluginStart;
  newsfeed?: NewsfeedPublicPluginStart;
  triggersActionsUi: TriggersActionsStart;
  uiActions: UiActionsStart;
  ml?: MlPluginStart;
}

export type StartServices = CoreStart &
  StartPlugins & {
    security: SecurityPluginSetup;
    storage: Storage;
  };

export interface PluginSetup {
  resolver: () => Promise<ResolverPluginSetup>;
}
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface PluginStart {}

export interface AppObservableLibs extends AppFrontendLibs {
  kibana: CoreStart;
}

export type InspectResponse = Inspect & { response: string[] };

export interface SubPlugins {
  detections: Detections;
  cases: Cases;
  hosts: Hosts;
  network: Network;
  overview: Overview;
  timelines: Timelines;
  management: Management;
}
