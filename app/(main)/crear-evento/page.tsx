'use client'

import { useState, useEffect } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Progress } from '@/components/ui/progress'
import { EventTypeSelector } from '@/components/event-creation/event-type-selector'
import { EventDetailsForm } from '@/components/event-creation/event-details-form'
import { ReviewStep } from '@/components/event-creation/review-step'
import { createEvent } from '@/app/actions/event-actions'
import { toast } from 'sonner'
import type { EventType, EventDetails, Padrino, CoupleInfo, QuinceaneraInfo, ChildInfo, HostInfo, ParentsInfo, LocationInfo } from '@/lib/types'
import { ArrowLeft, ArrowRight, Check } from 'lucide-react'

export interface EventFormData {
  eventType: EventType | null
  title: string
  invitationPhrase: string
  dressCode: string
  guestLimit: number | null
  petFriendly: boolean
  noKids: boolean
  eventDate: string
  eventTime: string
  coupleInfo?: CoupleInfo
  quinceaneraInfo?: QuinceaneraInfo
  childInfo?: ChildInfo
  hostInfo?: HostInfo
  parentsInfo?: ParentsInfo
  padrinos: Padrino[]
  churchInfo?: LocationInfo
  venueInfo?: LocationInfo
}

const initialFormData: EventFormData = {
  eventType: null,
  title: '',
  invitationPhrase: '',
  dressCode: '',
  guestLimit: null,
  petFriendly: false,
  noKids: false,
  eventDate: '',
  eventTime: '',
  padrinos: [],
}

const STEPS = [
  { id: 1, name: 'Tipo de Evento', description: 'Selecciona el tipo de evento' },
  { id: 2, name: 'Detalles', description: 'Informacion del evento' },
  { id: 3, name: 'Revisar', description: 'Confirma tu invitacion' },
]

export default function CreateEventPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [currentStep, setCurrentStep] = useState(1)
  const [formData, setFormData] = useState<EventFormData>(initialFormData)
  const [isSubmitting, setIsSubmitting] = useState(false)

  // Pre-fill event type from URL
  useEffect(() => {
    const tipo = searchParams.get('tipo') as EventType | null
    if (tipo && ['boda', 'xv', 'bautizo', 'graduacion', 'cumpleanos', 'otros'].includes(tipo)) {
      setFormData(prev => ({ ...prev, eventType: tipo }))
      setCurrentStep(2)
    }
  }, [searchParams])

  const updateFormData = (data: Partial<EventFormData>) => {
    setFormData(prev => ({ ...prev, ...data }))
  }

  const progress = (currentStep / STEPS.length) * 100

  const canProceed = () => {
    switch (currentStep) {
      case 1:
        return formData.eventType !== null
      case 2:
        return formData.title.trim() !== ''
      case 3:
        return true
      default:
        return false
    }
  }

  const handleNext = () => {
    if (currentStep < STEPS.length && canProceed()) {
      setCurrentStep(prev => prev + 1)
    }
  }

  const handleBack = () => {
    if (currentStep > 1) {
      setCurrentStep(prev => prev - 1)
    }
  }

  const handleSubmit = async () => {
    if (!formData.eventType) {
      toast.error('Por favor selecciona un tipo de evento')
      return
    }

    setIsSubmitting(true)

    const details: Partial<EventDetails> = {}
    
    if (formData.eventType === 'boda' && formData.coupleInfo) {
      details.couple_info = formData.coupleInfo
    }
    if (formData.eventType === 'xv' && formData.quinceaneraInfo) {
      details.quinceanera_info = formData.quinceaneraInfo
    }
    if (formData.eventType === 'bautizo' && formData.childInfo) {
      details.child_info = formData.childInfo
    }
    if (formData.hostInfo) {
      details.host_info = formData.hostInfo
    }
    if (formData.parentsInfo) {
      details.parents_info = formData.parentsInfo
    }
    if (formData.churchInfo) {
      details.church_info = formData.churchInfo
    }
    if (formData.venueInfo) {
      details.venue_info = formData.venueInfo
    }

    const result = await createEvent({
      eventType: formData.eventType,
      title: formData.title,
      invitationPhrase: formData.invitationPhrase,
      dressCode: formData.dressCode,
      guestLimit: formData.guestLimit || undefined,
      petFriendly: formData.petFriendly,
      noKids: formData.noKids,
      eventDate: formData.eventDate || undefined,
      eventTime: formData.eventTime || undefined,
      details,
      padrinos: formData.padrinos,
    })

    setIsSubmitting(false)

    if (result.error) {
      toast.error(result.error)
      return
    }

    toast.success('Evento creado exitosamente!')
    router.push(`/dashboard/eventos/${result.eventId}`)
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Crear Nueva Invitacion</h1>
            <p className="text-muted-foreground">
              Paso {currentStep} de {STEPS.length}: {STEPS[currentStep - 1].name}
            </p>
          </div>
          <Button variant="ghost" onClick={() => router.back()}>
            Cancelar
          </Button>
        </div>
        <Progress value={progress} className="h-2" />
        
        {/* Step Indicators */}
        <div className="mt-4 flex justify-between">
          {STEPS.map((step) => (
            <div
              key={step.id}
              className={`flex items-center gap-2 ${
                step.id === currentStep
                  ? 'text-primary'
                  : step.id < currentStep
                  ? 'text-muted-foreground'
                  : 'text-muted-foreground/50'
              }`}
            >
              <div
                className={`flex h-8 w-8 items-center justify-center rounded-full border-2 text-sm font-medium ${
                  step.id === currentStep
                    ? 'border-primary bg-primary text-primary-foreground'
                    : step.id < currentStep
                    ? 'border-primary bg-primary/10 text-primary'
                    : 'border-muted-foreground/30'
                }`}
              >
                {step.id < currentStep ? <Check className="h-4 w-4" /> : step.id}
              </div>
              <span className="hidden sm:inline text-sm">{step.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Step Content */}
      <div className="mb-8">
        {currentStep === 1 && (
          <EventTypeSelector
            selected={formData.eventType}
            onSelect={(type) => updateFormData({ eventType: type })}
          />
        )}
        
        {currentStep === 2 && formData.eventType && (
          <EventDetailsForm
            eventType={formData.eventType}
            formData={formData}
            updateFormData={updateFormData}
          />
        )}
        
        {currentStep === 3 && formData.eventType && (
          <ReviewStep formData={formData} />
        )}
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center justify-between">
        <Button
          variant="outline"
          onClick={handleBack}
          disabled={currentStep === 1}
          className="rounded-xl"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Anterior
        </Button>

        {currentStep < STEPS.length ? (
          <Button
            onClick={handleNext}
            disabled={!canProceed()}
            className="rounded-xl"
          >
            Siguiente
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        ) : (
          <Button
            onClick={handleSubmit}
            disabled={isSubmitting || !canProceed()}
            className="rounded-xl"
          >
            {isSubmitting ? 'Creando...' : 'Crear Invitacion'}
            <Check className="ml-2 h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
