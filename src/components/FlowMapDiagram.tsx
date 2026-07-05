import { Image, Platform, Pressable, Text, View } from 'react-native';

import {
  FLOW_FRAME_MIN_HEIGHT,
  FLOW_MAP_JOURNEYS,
  FLOW_MAP_SCREENS,
  FLOW_NODE_WIDTH,
  journeyCanvasSize,
  journeyScreenIds,
  nodeTotalHeight,
  type FlowMapJourney,
  type FlowMapLayoutEdge,
  type FlowMapLayoutNode,
  type FlowMapScreen,
  type FlowNavigateContext,
} from '../constants/flowMap';
import { getFlowManifest, getScreenManifest } from '../constants/flowMapManifest';
import { FLOW_SCREEN_IMAGES } from '../constants/flowScreenImages';
import { navigateFlowScreen } from '../utils/flowMapNavigate';
import { downloadFlowScreenCapture, downloadFlowScreensBulk } from '../utils/flowScreenDownload';
import { formatFlowMapVersionStatus } from '../utils/flowMapVersionFormat';
import { WireframeSection } from './Wireframe';

const ARROW = '#2563EB';
const ARROW_FILL = '#EFF6FF';
const CANVAS_BG = '#F4F7FB';

function DownloadButton({
  label,
  onPress,
  accessibilityLabel,
}: {
  label: string;
  onPress: () => void;
  accessibilityLabel: string;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityLabel={accessibilityLabel}
      style={({ pressed }) => ({
        borderWidth: 1,
        borderColor: '#2563EB',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        backgroundColor: pressed ? '#DBEAFE' : '#EFF6FF',
      })}
    >
      <Text style={{ fontSize: 12, fontWeight: '600', color: '#1D4ED8' }}>{label}</Text>
    </Pressable>
  );
}

function VersionStatus({ version, updatedAt }: { version: string; updatedAt: string }) {
  return (
    <Text style={{ fontSize: 11, color: '#9CA3AF', textAlign: 'center', lineHeight: 15 }}>
      {formatFlowMapVersionStatus(version, updatedAt)}
    </Text>
  );
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
                fill="#1D4ED8"
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
}: {
  screen: FlowMapScreen;
  subtitle?: string;
  x: number;
  y: number;
  frameHeight: number;
  onPress: () => void;
}) {
  const imageSource = FLOW_SCREEN_IMAGES[screen.id];
  const canDownload = Boolean(imageSource);
  const screenMeta = getScreenManifest(screen.id);

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
        style={({ pressed }) => ({
          opacity: pressed ? 0.92 : 1,
          transform: [{ scale: pressed ? 0.98 : 1 }],
        })}
      >
        <View
          style={{
            width: FLOW_NODE_WIDTH,
            height: frameHeight,
            minHeight: FLOW_FRAME_MIN_HEIGHT,
            borderRadius: 24,
            borderWidth: 2,
            borderColor: '#D1D5DB',
            backgroundColor: '#FFF',
            overflow: 'hidden',
            shadowColor: '#000',
            shadowOpacity: 0.08,
            shadowRadius: 12,
            shadowOffset: { width: 0, height: 4 },
            elevation: 3,
          }}
        >
          {imageSource ? (
            <Image
              source={imageSource}
              style={{ width: '100%', height: '100%' }}
              resizeMode="contain"
              accessibilityLabel={screen.label}
            />
          ) : (
            <View style={{ flex: 1, backgroundColor: '#E5E7EB', alignItems: 'center', justifyContent: 'center' }}>
              <Text style={{ color: '#6B7280', fontSize: 12 }}>No preview</Text>
            </View>
          )}
        </View>
      </Pressable>

      <View
        style={{
          marginTop: 10,
          flexDirection: 'row',
          alignItems: 'center',
          justifyContent: 'center',
          gap: 8,
          flexWrap: 'wrap',
        }}
      >
        <Text
          style={{
            fontWeight: '700',
            fontSize: 14,
            textAlign: 'center',
            color: '#111827',
          }}
        >
          {screen.label}
        </Text>
        {canDownload ? (
          <DownloadButton
            label="Download"
            onPress={() => {
              void downloadFlowScreenCapture(screen.id, screen.label);
            }}
            accessibilityLabel={`Download screenshot of ${screen.label}`}
          />
        ) : null}
      </View>

      {subtitle ? (
        <Text style={{ marginTop: 2, fontSize: 11, textAlign: 'center', color: '#6B7280', lineHeight: 15 }}>
          {subtitle}
        </Text>
      ) : null}

      {screenMeta ? (
        <View style={{ marginTop: 4 }}>
          <VersionStatus version={screenMeta.version} updatedAt={screenMeta.updatedAt} />
        </View>
      ) : null}
    </View>
  );
}

function FlowJourneyCanvas({
  journey,
  onScreenPress,
}: {
  journey: FlowMapJourney;
  onScreenPress: (screen: FlowMapScreen) => void;
}) {
  const { width, height, nodes } = journeyCanvasSize(journey);
  const nodeById = new Map(nodes.map((n) => [n.nodeId, n]));
  const flowMeta = getFlowManifest(journey.id);
  const bulkItems = journeyScreenIds(journey)
    .filter((id) => FLOW_SCREEN_IMAGES[id])
    .map((id) => ({
      screenId: id,
      label: FLOW_MAP_SCREENS[id]?.label ?? id,
    }));
  const canBulkDownload = bulkItems.length > 0;

  return (
    <WireframeSection
      title={journey.title}
      subtitle={flowMeta ? formatFlowMapVersionStatus(flowMeta.version, flowMeta.updatedAt) : undefined}
      headerAction={
        canBulkDownload ? (
          <DownloadButton
            label="Download all"
            onPress={() => {
              void downloadFlowScreensBulk(bulkItems, journey.title);
            }}
            accessibilityLabel={`Download all screenshots for ${journey.title}`}
          />
        ) : undefined
      }
    >
      <Text style={{ color: '#6B7280', marginBottom: 16, lineHeight: 20 }}>{journey.description}</Text>
      <View
        style={{
          width: '100%',
          overflow: 'visible',
        }}
      >
        <View
          style={{
            width,
            height,
            backgroundColor: CANVAS_BG,
            borderRadius: 16,
            borderWidth: 1,
            borderColor: '#E5E7EB',
            overflow: 'visible',
            alignSelf: 'flex-start',
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
                subtitle={node.subtitle ?? screen.subtitle}
                x={node.x}
                y={node.y}
                frameHeight={node.frameHeight}
                onPress={() => onScreenPress(screen)}
              />
            );
          })}
        </View>
      </View>
    </WireframeSection>
  );
}

export function FlowMapDiagram({
  navigateCtx,
  journeyFilter,
}: {
  navigateCtx: FlowNavigateContext;
  journeyFilter?: FlowMapJourney['id'] | 'all';
}) {
  const journeys =
    journeyFilter && journeyFilter !== 'all'
      ? FLOW_MAP_JOURNEYS.filter((j) => j.id === journeyFilter)
      : FLOW_MAP_JOURNEYS;

  const handlePress = (screen: FlowMapScreen) => {
    navigateFlowScreen(screen, navigateCtx);
  };

  return (
    <>
      {journeys.map((journey) => (
        <FlowJourneyCanvas key={journey.id} journey={journey} onScreenPress={handlePress} />
      ))}
    </>
  );
}
