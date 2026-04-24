import { type EventName, type NoneType, type MouseType, type JointType, type CreateType, type EventType, type Position, type CameraType, type ParticleCode, type defaultRegistryType, type GamePhase, type DamageTextType } from "../types/engine"

export const mockEventName: EventName = "JOINT"

export const mockNoneType: NoneType = "NONE"

export const mockMouseType: MouseType = "NONE"

export const mockJointType: JointType = "HINGE"

export const mockCreateType: CreateType = "CIRCLE"

export const mockEventType: EventType = "NONE"

export const mockPosition: Position = {
  x: 66,
  y: 49
}

export const mockCameraType: CameraType = {
  x: 43,
  y: 49,
  scale: 79
}

export const mockParticleCode: ParticleCode = "aperiam"

export const mockdefaultRegistryType: defaultRegistryType = {
  createdId: 45,
  selectedObjectId: 33,
  mouseEventType: "NONE",
  setMouseEventType: null,
  jointEventType: "FIXED",
  createEventType: "CIRCLE",
  animationOffset: 57,
  gamePhase: "pause",
  memory: {},
  gameTime: 35
}

export const mockGamePhase: GamePhase = "pause"

export const mockDamageTextType: DamageTextType = {
  x: 12,
  y: 42,
  value: 73,
  alpha: 94,
  lifespan: 89,
  velocityY: 16
}