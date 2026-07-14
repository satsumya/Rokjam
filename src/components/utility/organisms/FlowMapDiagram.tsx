import { Image, Platform, Pressable, ScrollView, View } from 'react-native';

import {
  FLOW_FRAME_MIN_HEIGHT,
  FLOW_MAP_JOURNEYS,
  FLOW_MAP_SCREENS,
  FLOW_NODE_WIDTH,
  compareFlowPlacements,
  journeyCanvasSize,
  nodeTotalHeight,
  type FlowMapJourney,
  type FlowMapLayoutEdge,
  type FlowMapLayoutNode,
  type FlowMapPlacement,
  type FlowMapScreen,
  type FlowNavigateContext,
} from '../../../constants/flowMap';
import { getFlowManifest, getScreenManifest } from '../../../constants/flowMapManifest';
import { FLOW_SCREEN_IMAGES } from '../../../constants/flowScreenImages';
import { useFlowMapCapture } from '../../../hooks/useFlowMapCapture';
import { navigateFlowScreen } from '../../../utils/flowMapNavigate';
import { downloadFlowScreenCapture, downloadFlowScreensBulk } from '../../../utils/flowScreenDownload';
import type { FlowScreenDownloadInput } from '../../../utils/flowScreenDownload';
import { flowScreenPreviewSource } from '../../../utils/flowScreenCaptureClient';
import { formatFlowScreenDisplayName } from '../../../utils/flowScreenNaming';
import type { FlowMapVersionEntry } from '../../../constants/flowMapManifest';

import { FlowMapActionButton } from '../atoms/FlowMapActionButton';
import { Section } from '../../atoms/Section';
import { Text } from '../../atoms/Text';
import { FlowMapVersionAccordion } from '../molecules/FlowMapVersionAccordion';
import { colors, ui } from '../../../theme/colors';
import { focusRing, interactionFlags } from '../../../theme/interaction';
import { space } from '../../../theme/spacing';

const ARROW = colors.brand.blue.dark;
const ARROW_FILL = colors.brand.blue.light;
const CANVAS_BG = ui.surfaceMuted;

function flowScreenDisplayName(screen: FlowMapScreen) {
  return formatFlowScreenDisplayName(screen.label, screen.descriptors, screen.downloadTag);
}

function flowScreenDownloadItem(
  screen: FlowMapScreen,
  placement?: FlowMapPlacement,
): FlowScreenDownloadInput {
  return {
    screenId: screen.id,
    label: screen.label,
    descriptors: screen.descriptors,
    downloadTag: screen.downloadTag,
    downloadDescriptors: screen.downloadDescriptors,
    placement,
  };
}

type Rect = { x: number; y: number; w: number; frameH: number; totalH: number };

function nodeRect(node: FlowMapLayoutNode): Rect {
  const totalH = nodeTotalHeight(node.frameHeight);
  return { x: node.x, y: node.y, w: FLOW_NODE_WIDTH, frameH: node.frameHeight, totalH };
}

function anchorPoint(rect: Rect, side: 'right' | 'left' | 'bottom' | 'top') {
  switch (side) {
    case 'right':
      return { x: rect.x + rect.w, y: rect.y + rect.frameH / 2 };
    case 'left':
      return { x: rect.x, y: rect.y + rect.frameH / 2 };
    case 'bottom':
      return { x: rect.x + rect.w / 2, y: rect.y + rect.frameH };
    case 'top':
      return { x: rect.x + rect.w / 2, y: rect.y };
  }
}

function pickAnchors(from: Rect, to: Rect): { start: { x: number; y: number }; end: { x: number; y: number } } {
  const fromCenterX = from.x + from.w / 2;
  const toCenterX = to.x + to.w / 2;
  const fromCenterY = from.y + from.frameH / 2;
  const toCenterY = to.y + to.frameH / 2;

  // Journey progresses left → right between steps
  if (toCenterX > fromCenterX + 24) {
    return { start: anchorPoint(from, 'right'), end: anchorPoint(to, 'left') };
  }
  if (toCenterX < fromCenterX - 24) {
    return { start: anchorPoint(from, 'left'), end: anchorPoint(to, 'right') };
  }

  // Same step: alternate paths stack vertically
  if (toCenterY > fromCenterY) {
    return { start: anchorPoint(from, 'bottom'), end: anchorPoint(to, 'top') };
  }
  return { start: anchorPoint(from, 'top'), end: anchorPoint(to, 'bottom') };
}

function edgePath(start: { x: number; y: number }, end: { x: number; y: number }) {
  const dx = end.x - start.x;
  const dy = end.y - start.y;

  if (Math.abs(dx) < 8 && Math.abs(dy) < 8) {
    return `M ${start.x} ${start.y} L ${end.x} ${end.y}`;
  }

  // Prefer horizontal routing for forward journey steps
  if (Math.abs(dx) >= Math.abs(dy)) {
    const midX = (start.x + end.x) / 2;
    return `M ${start.x} ${start.y} L ${midX} ${start.y} L ${midX} ${end.y} L ${end.x} ${end.y}`;
  }

  const midY = (start.y + end.y) / 2;
  return `M ${start.x} ${start.y} L ${start.x} ${midY} L ${end.x} ${midY} L ${end.x} ${end.y}`;
}

function FlowEdgesSvg({
  journeyId,
  edges,
  nodeById,
  width,
  height,
}: {
  journeyId: string;
  edges: FlowMapLayoutEdge[];
  nodeById: Map<string, FlowMapLayoutNode>;
  width: number;
  height: number;
}) {
  if (Platform.OS !== 'web') return null;

  const markerId = `flow-arrow-${journeyId}`;

  const paths = edges
    .map((edge) => {
      const fromNode = nodeById.get(edge.from);
      const toNode = nodeById.get(edge.to);
      if (!fromNode || !toNode) return null;

      const from = nodeRect(fromNode);
      const to = nodeRect(toNode);
      const { start, end } = pickAnchors(from, to);
      const d = edgePath(start, end);
      const labelX = (start.x + end.x) / 2;
      const labelY = (start.y + end.y) / 2 - 14;

      return { edge, d, labelX, labelY };
    })
    .filter(Boolean) as {
    edge: FlowMapLayoutEdge;
    d: string;
    labelX: number;
    labelY: number;
  }[];

  return (
    <View
      style={{
        position: 'absolute',
        left: 0,
        top: 0,
        width,
        height,
        pointerEvents: 'none',
      }}
    >
      <svg width={width} height={height} style={{ position: 'absolute', left: 0, top: 0 }}>
        <defs>
          <marker
            id={markerId}
            markerWidth="8"
            markerHeight="8"
            refX="6"
            refY="4"
            orient="auto"
            markerUnits="strokeWidth"
          >
            <path d="M0,0 L8,4 L0,8 Z" fill={ARROW} />
          </marker>
        </defs>
        {paths.map(({ edge, d }) => (
          <path
            key={`${edge.from}-${edge.to}`}
            d={d}
            fill="none"
            stroke={ARROW}
            strokeWidth={2}
            markerEnd={`url(#${markerId})`}
          />
        ))}
        {paths.map(({ edge, labelX, labelY }) => {
          const labelW = Math.min(180, Math.max(88, edge.label.length * 7.2));
          return (
            <g key={`label-${edge.from}-${edge.to}`}>
              <rect
                x={labelX - labelW / 2}
                y={labelY - 10}
                width={labelW}
                height={20}
                rx={10}
                fill={ARROW_FILL}
                stroke={ARROW}
                strokeWidth={1}
              />
              <text
                x={labelX}
                y={labelY + 4}
                textAnchor="middle"
                fontSize={11}
                fontWeight="600"
                fill={ARROW}
                fontFamily="system-ui, -apple-system, sans-serif"
              >
                {edge.label}
              </text>
            </g>
          );
        })}
      </svg>
    </View>
  );
}

function FlowScreenNode({
  screen,
  subtitle,
  x,
  y,
  frameHeight,
  onPress,
  placement,
  cacheKey,
  onUpdate,
  updating,
  canUpdate,
}: {
  screen: FlowMapScreen;
  subtitle?: string;
  placement: FlowMapPlacement;
  x: number;
  y: number;
  frameHeight: number;
  onPress: () => void;
  cacheKey?: string;
  onUpdate?: () => void;
  updating?: boolean;
  canUpdate?: boolean;
}) {
  const bundled = FLOW_SCREEN_IMAGES[screen.id];
  const previewUri = flowScreenPreviewSource(screen.id, cacheKey);
  const imageSource = previewUri ?? (bundled ? bundled : null);
  const canDownload = Boolean(bundled || previewUri);
  const displayName = flowScreenDisplayName(screen);
  const downloadItem = flowScreenDownloadItem(screen, placement);

  return (
    <View
      style={{
        position: 'absolute',
        left: x,
        top: y,
        width: FLOW_NODE_WIDTH,
      }}
    >
      <Pressable
        onPress={onPress}
        style={(state) => {
          const { pressed, hovered, focused } = interactionFlags(state);
          return {
            borderRadius: 24,
            opacity: pressed ? 0.92 : 1,
            transform: [{ scale: pressed ? 0.98 : hovered ? 1.01 : 1 }],
            ...(focused ? focusRing : null),
          };
        }}
      >
        <View
          style={{
            width: FLOW_NODE_WIDTH,
            height: frameHeight,
            minHeight: FLOW_FRAME_MIN_HEIGHT,
            borderRadius: 24,
            borderWidth: 2,
            borderColor: ui.border,
            backgroundColor: ui.surface,
            overflow: 'hidden',
            shadowColor: ui.shadow,
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          {imageSource ? (
            <Image
              source={typeof imageSource === 'number' ? imageSource : imageSource}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
              accessibilityLabel={displayName}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: ui.borderSubtle, alignItems: 'center', justifyContent: 'center' }}>
              <Text variant="bodySmall" color={ui.textMuted}>
                No preview
              </Text>
            </View>
          )}
        </View>
      </Pressable>

      <View
        style={{
          marginTop: space[12],
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: space[8],
          flexWrap: 'wrap',
        }}
      >
        <Text variant="body" weight="bold" style={{ textAlign: 'center' }}>
          {displayName}
        </Text>
        {canDownload ? (
          <FlowMapActionButton
            label="Download"
            onPress={() => {
              void downloadFlowScreenCapture(downloadItem);
            }}
            accessibilityLabel={`Download screenshot of ${displayName}`}
          />
        ) : null}
        {canUpdate && onUpdate ? (
          <FlowMapActionButton
            label={updating ? 'Updating…' : 'Update'}
            variant="update"
            disabled={updating}
            onPress={onUpdate}
            accessibilityLabel={`Update screenshot of ${displayName}`}
          />
        ) : null}
      </View>

      {subtitle ? (
        <Text
          variant="bodySmall"
          color={ui.textMuted}
          style={{ marginTop: space[4], fontSize: 11, textAlign: 'center' }}
        >
          {subtitle}
        </Text>
      ) : null}
    </View>
  );
}

function FlowJourneyCanvas({
  journey,
  onScreenPress,
  extraDimensions,
  screenMetaMap,
  flowMetaEntry,
  cacheKeys,
  onUpdateScreen,
  onUpdateFlow,
  busyKey,
  canUpdate,
}: {
  journey: FlowMapJourney;
  onScreenPress: (screen: FlowMapScreen) => void;
  extraDimensions: Record<string, { width: number; height: number }>;
  screenMetaMap: Record<string, FlowMapVersionEntry>;
  flowMetaEntry?: FlowMapVersionEntry;
  cacheKeys: Record<string, string>;
  onUpdateScreen: (screenId: string) => void;
  onUpdateFlow: (flowId: string) => void;
  busyKey: string | null;
  canUpdate: boolean;
}) {
  const { width, height, nodes } = journeyCanvasSize(journey, extraDimensions);
  const nodeById = new Map(nodes.map((n) => [n.nodeId, n]));
  const flowMeta = flowMetaEntry ?? getFlowManifest(journey.id);
  const bulkItems = nodes
    .filter((node) => FLOW_SCREEN_IMAGES[node.screenId])
    .map((node) => {
      const screen = FLOW_MAP_SCREENS[node.screenId];
      if (!screen) return null;
      return flowScreenDownloadItem(screen, node.placement);
    })
    .filter((item): item is FlowScreenDownloadInput => item != null)
    .sort((a, b) => {
      if (!a.placement || !b.placement) return 0;
      return compareFlowPlacements(a.placement, b.placement);
    });
  const canBulkDownload = bulkItems.length > 0;
  const flowBusy = busyKey === `flow:${journey.id}`;

  const versionItems = [
    ...(flowMeta
      ? [{ label: journey.title, version: flowMeta.version, updatedAt: flowMeta.updatedAt }]
      : []),
    ...nodes.flatMap((node) => {
      const screen = FLOW_MAP_SCREENS[node.screenId];
      const meta = screenMetaMap[node.screenId] ?? getScreenManifest(node.screenId);
      if (!screen || !meta) return [];
      return [
        {
          label: flowScreenDisplayName(screen),
          version: meta.version,
          updatedAt: meta.updatedAt,
        },
      ];
    }),
  ];

  return (
    <Section
      title={journey.title}
      headerAction={
        canBulkDownload || canUpdate ? (
          <View style={{ flexDirection: 'row', gap: space[8], flexWrap: 'wrap', justifyContent: 'flex-end' }}>
            {canUpdate ? (
              <FlowMapActionButton
                label={flowBusy ? 'Updating…' : 'Update all'}
                variant="update"
                disabled={flowBusy || Boolean(busyKey)}
                onPress={() => onUpdateFlow(journey.id)}
                accessibilityLabel={`Update all screenshots for ${journey.title}`}
              />
            ) : null}
            {canBulkDownload ? (
              <FlowMapActionButton
                label="Download all"
                onPress={() => {
                  void downloadFlowScreensBulk(bulkItems, journey.title, flowMeta?.version);
                }}
                accessibilityLabel={`Download all screenshots for ${journey.title}`}
              />
            ) : null}
          </View>
        ) : undefined
      }
    >
      <FlowMapVersionAccordion items={versionItems} />
      <Text variant="body" color={ui.textMuted} style={{ marginBottom: space[16] }}>
        {journey.description}
      </Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator
        nestedScrollEnabled
        style={{ width: '100%' }}
        contentContainerStyle={{ flexGrow: 0 }}
      >
        <View
          style={{
            width,
            height,
            backgroundColor: CANVAS_BG,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: ui.borderSubtle,
            overflow: 'hidden',
          }}
        >
          <FlowEdgesSvg
            journeyId={journey.id}
            edges={journey.edges}
            nodeById={nodeById}
            width={width}
            height={height}
          />
          {nodes.map((node) => {
            const screen = FLOW_MAP_SCREENS[node.screenId];
            if (!screen) return null;
            return (
              <FlowScreenNode
                key={node.nodeId}
                screen={screen}
                subtitle={node.subtitle}
                placement={node.placement}
                x={node.x}
                y={node.y}
                frameHeight={node.frameHeight}
                onPress={() => onScreenPress(screen)}
                cacheKey={cacheKeys[node.screenId]}
                onUpdate={() => onUpdateScreen(node.screenId)}
                updating={busyKey === `screen:${node.screenId}`}
                canUpdate={canUpdate}
              />
            );
          })}
        </View>
      </ScrollView>
    </Section>
  );
}

export function FlowMapDiagram({
  navigateCtx,
  journeyFilter,
}: {
  navigateCtx: FlowNavigateContext;
  journeyFilter?: FlowMapJourney['id'] | 'all';
}) {
  const capture = useFlowMapCapture();
  const canUpdate = Platform.OS === 'web' && capture.serverReady === true;

  const journeys =
    journeyFilter && journeyFilter !== 'all'
      ? FLOW_MAP_JOURNEYS.filter((j) => j.id === journeyFilter)
      : FLOW_MAP_JOURNEYS;

  const handlePress = (screen: FlowMapScreen) => {
    navigateFlowScreen(screen, navigateCtx);
  };

  return (
    <>
      {Platform.OS === 'web' && capture.serverReady === false ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.brand.yellow.accent,
            backgroundColor: colors.brand.yellow.light,
            borderRadius: 8,
            padding: space[12],
            marginBottom: space[12],
          }}
        >
          <Text variant="body" color={colors.brand.yellow.dark}>
            To use Update buttons, run{' '}
            <Text variant="body" weight="bold">
              npm run flow-map-capture-server
            </Text>{' '}
            in a second terminal while this app is running.
          </Text>
        </View>
      ) : null}
      {capture.error ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.brand.red.accent,
            backgroundColor: colors.brand.red.light,
            borderRadius: 8,
            padding: space[12],
            marginBottom: space[12],
          }}
        >
          <Text variant="body" color={colors.brand.red.dark}>
            {capture.error}
          </Text>
        </View>
      ) : null}
      {capture.info ? (
        <View
          style={{
            borderWidth: 1,
            borderColor: colors.brand.green.accent,
            backgroundColor: colors.brand.green.light,
            borderRadius: 8,
            padding: space[12],
            marginBottom: space[12],
          }}
        >
          <Text variant="body" color={colors.brand.green.dark}>
            {capture.info}
          </Text>
        </View>
      ) : null}
      {journeys.map((journey) => (
        <FlowJourneyCanvas
          key={journey.id}
          journey={journey}
          onScreenPress={handlePress}
          extraDimensions={capture.dimensions}
          screenMetaMap={capture.screenMeta}
          flowMetaEntry={capture.flowMeta[journey.id]}
          cacheKeys={capture.cacheKeys}
          onUpdateScreen={capture.updateScreen}
          onUpdateFlow={capture.updateFlow}
          busyKey={capture.busyKey}
          canUpdate={canUpdate}
        />
      ))}
    </>
  );
}
