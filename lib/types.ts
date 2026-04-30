export type EventType = 'boda' | 'xv' | 'bautizo' | 'graduacion' | 'cumpleanos' | 'otros'

export interface Profile {
  id: string
  full_name: string | null
  avatar_url: string | null
  role: string
  created_at: string
  updated_at: string
}

export interface Event {
  id: string
  user_id: string
  event_type: EventType
  title: string
  slug: string
  invitation_phrase: string | null
  dress_code: string | null
  guest_limit: number | null
  pet_friendly: boolean
  no_kids: boolean
  event_date: string | null
  event_time: string | null
  cover_image_url: string | null
  status: 'draft' | 'published' | 'archived'
  template_id: string | null
  created_at: string
  updated_at: string
}

export interface EventDetails {
  id: string
  event_id: string
  couple_info: CoupleInfo | null
  quinceanera_info: QuinceaneraInfo | null
  child_info: ChildInfo | null
  host_info: HostInfo | null
  parents_info: ParentsInfo | null
  padrinos: Padrino[] | null
  church_info: LocationInfo | null
  photo_info: LocationInfo | null
  venue_info: LocationInfo | null
  additional_info: Record<string, unknown> | null
  created_at: string
  updated_at: string
}

export interface CoupleInfo {
  partner1_name: string
  partner2_name: string
  partner1_parents?: string
  partner2_parents?: string
  story?: string
}

export interface QuinceaneraInfo {
  name: string
  parents?: string
  story?: string
}

export interface ChildInfo {
  name: string
  parents?: string
  godparents?: string
}

export interface HostInfo {
  name: string
  message?: string
}

export interface ParentsInfo {
  father_name?: string
  mother_name?: string
  message?: string
}

export interface Padrino {
  name: string
  role_type: PadrinoType
  phone?: string
}

export type PadrinoType = 
  | 'honor'
  | 'velacion'
  | 'lazo'
  | 'arras'
  | 'anillos'
  | 'biblia'
  | 'rosario'
  | 'ramo'
  | 'brindis'
  | 'pastel'
  | 'vals'
  | 'ultima_muneca'
  | 'zapato'
  | 'corona'
  | 'cojin'
  | 'general'

export interface LocationInfo {
  name: string
  address?: string
  city?: string
  maps_url?: string
  time?: string
}

export interface Participant {
  id: string
  event_id: string
  role: string
  role_type: string | null
  full_name: string
  phone: string | null
  email: string | null
  created_at: string
}

export interface Location {
  id: string
  event_id: string
  location_type: 'church' | 'venue' | 'photo' | 'other'
  name: string
  address: string | null
  city: string | null
  maps_url: string | null
  time: string | null
  created_at: string
}

export interface Gift {
  id: string
  event_id: string
  title: string
  description: string | null
  price: number | null
  image_url: string | null
  store_url: string | null
  claimed_by: string | null
  created_at: string
}

export interface RSVP {
  id: string
  event_id: string
  guest_name: string
  guest_email: string | null
  guest_phone: string | null
  num_attendees: number
  dietary_restrictions: string | null
  message: string | null
  status: 'pending' | 'confirmed' | 'declined'
  responded_at: string | null
  created_at: string
}

export interface Template {
  id: string
  name: string
  event_type: EventType
  preview_image_url: string | null
  config: Record<string, unknown>
  is_premium: boolean
  created_at: string
}

export const EVENT_TYPE_LABELS: Record<EventType, string> = {
  boda: 'Boda',
  xv: 'XV Anos',
  bautizo: 'Bautizo',
  graduacion: 'Graduacion',
  cumpleanos: 'Cumpleanos',
  otros: 'Otro Evento'
}

export const PADRINO_TYPE_LABELS: Record<PadrinoType, string> = {
  honor: 'Padrinos de Honor',
  velacion: 'Padrinos de Velacion',
  lazo: 'Padrinos de Lazo',
  arras: 'Padrinos de Arras',
  anillos: 'Padrinos de Anillos',
  biblia: 'Padrinos de Biblia',
  rosario: 'Padrinos de Rosario',
  ramo: 'Padrinos de Ramo',
  brindis: 'Padrinos de Brindis',
  pastel: 'Padrinos de Pastel',
  vals: 'Padrinos de Vals',
  ultima_muneca: 'Padrinos de Ultima Muneca',
  zapato: 'Padrinos de Zapato',
  corona: 'Padrinos de Corona',
  cojin: 'Padrinos de Cojin',
  general: 'Padrinos'
}
