import type { EventName, NoneType, MouseType, JointType, CreateType, EventType, Position, CameraType, ParticleCode, defaultRegistryType, GamePhase, DamageTextType } from "../types/engine"

export const mockEventName: EventName = "CREATE"

export const mockNoneType: NoneType = "NONE"

export const mockMouseType: MouseType = "EDIT"

export const mockJointType: JointType = "REVERSE"

export const mockCreateType: CreateType = "CIRCLE"

export const mockEventType: EventType = "DRAG"

export const mockPosition: Position = {
  x: 47,
  y: 87
}

export const mockCameraType: CameraType = {
  x: 48,
  y: 49,
  scale: 99
}

export const mockParticleCode: ParticleCode = "crux"

export const mockdefaultRegistryType: defaultRegistryType = {
  createdId: 76,
  selectedObjectId: 68,
  mouseEventType: "NONE",
  jointEventType: "REVERSE",
  createEventType: "CIRCLE",
  animationOffset: 21,
  gamePhase: "pause",
  memory: {},
  gameTime: 46
}

export const mockGamePhase: GamePhase = "play"

export const mockDamageTextType: DamageTextType = {
  x: 68,
  y: 58,
  value: 47,
  alpha: 65,
  lifespan: 23,
  velocityY: 64
}