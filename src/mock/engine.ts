import type { EventName, NoneType, MouseType, JointType, CreateType, EventType, Position, CameraType, ParticleCode, GamePhase, DamageTextType, defaultRegistryType } from "../types/engine"

export const mockEventName: EventName = "CREATE"

export const mockNoneType: NoneType = "NONE"

export const mockMouseType: MouseType = "EDIT"

export const mockJointType: JointType = "HINGE"

export const mockCreateType: CreateType = "RECTANGLE"

export const mockEventType: EventType = "NONE"

export const mockPosition: Position = {
  x: 38.64,
  y: 90.38
}

export const mockCameraType: CameraType = {
  x: 29.51,
  y: 62.58,
  scale: 58.8
}

export const mockParticleCode: ParticleCode = "basium"

export const mockGamePhase: GamePhase = "play"

export const mockDamageTextType: DamageTextType = {
  x: 74.41,
  y: 58.34,
  value: 63.71,
  alpha: 27.14,
  lifespan: 34.63,
  velocityY: 13.87
}

export const mockdefaultRegistryType: defaultRegistryType = {
  createdId: 33.13,
  selectedObjectId: 9.77,
  mouseEventType: "CREATE",
  jointEventType: "REVERSE",
  createEventType: "RECTANGLE",
  animationOffset: 85.88,
  gamePhase: "play",
  gameTime: 92.58,
  setMouseEventType: function (mouseType: MouseType): void {
    throw new Error("Function not implemented.")
  },
  memory: undefined
}