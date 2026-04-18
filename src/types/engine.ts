export type EventName = 'MOUSE' | 'JOINT' | 'CREATE';

export type NoneType = 'NONE';

export type MouseType = NoneType | 'DRAG' | 'JOINT' | 'CREATE' | 'EDIT';

export type JointType = NoneType | 'FORCE' | 'SPRING' | 'REVERSE' | 'FIXED' | 'HINGE';

export type CreateType = NoneType | 'RECTANGLE' | 'CIRCLE' | 'MAGICIAN';

export type EventType = NoneType | MouseType | JointType | CreateType;

export type Position = { x: number; y: number };

export type CameraType = {
  x: number;
  y: number;
  scale: number;
};

/**
 * @type ParticleCode
 * @description `${partidleId}`
 */
export type ParticleCode = string;

export type defaultRegistryType = {
  createdId: number;
  selectedObjectId: number;
  mouseEventType: MouseType;
  setMouseEventType: (mouseType: MouseType) => void;
  jointEventType: JointType;
  createEventType: CreateType;
  animationOffset: number;
  gamePhase: GamePhase;
  memory: WebAssembly.Memory;
  gameTime: number;
};

export type GamePhase = 'play' | 'pause';

export type DamageTextType = {
  x: number;
  y: number;
  value: number;
  alpha: number; // 투명도
  lifespan: number; // 남은 시간 (밀리초)
  velocityY: number; // 위로 떠오르는 속도
};