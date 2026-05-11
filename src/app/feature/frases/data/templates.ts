import { Pictogram } from "../../expresate/models/pictogram.types";

export interface Template {
  id: string;
  name: string; // Key de traducción
  category: 'greetings' | 'needs' | 'emotions';
  pictograms: Partial<Pictogram>[];
}

export const PREDEFINED_TEMPLATES: Template[] = [
  // SALUDOS
  {
    id: 't-greet-1',
    name: 'template_hello',
    category: 'greetings',
    pictograms: [
      { id: '2384', arasaac_id: '2384', keyword: 'hola', language: 'es' }
    ]
  },
  {
    id: 't-greet-2',
    name: 'template_good_morning',
    category: 'greetings',
    pictograms: [
      { id: '2384', arasaac_id: '2384', keyword: 'hola', language: 'es' },
      { id: '2410', arasaac_id: '2410', keyword: 'buenos días', language: 'es' }
    ]
  },
  {
    id: 't-greet-3',
    name: 'template_thanks',
    category: 'greetings',
    pictograms: [
      { id: '2398', arasaac_id: '2398', keyword: 'gracias', language: 'es' }
    ]
  },
  {
    id: 't-greet-4',
    name: 'template_please',
    category: 'greetings',
    pictograms: [
      { id: '2397', arasaac_id: '2397', keyword: 'por favor', language: 'es' }
    ]
  },
  // NECESIDADES
  {
    id: 't-need-1',
    name: 'template_hungry',
    category: 'needs',
    pictograms: [
      { id: '3436', arasaac_id: '3436', keyword: 'tengo', language: 'es' },
      { id: '2405', arasaac_id: '2405', keyword: 'hambre', language: 'es' }
    ]
  },
  {
    id: 't-need-2',
    name: 'template_thirsty',
    category: 'needs',
    pictograms: [
      { id: '3436', arasaac_id: '3436', keyword: 'tengo', language: 'es' },
      { id: '2406', arasaac_id: '2406', keyword: 'sed', language: 'es' }
    ]
  },
  {
    id: 't-need-3',
    name: 'template_bathroom',
    category: 'needs',
    pictograms: [
      { id: '2415', arasaac_id: '2415', keyword: 'necesito', language: 'es' },
      { id: '2416', arasaac_id: '2416', keyword: 'baño', language: 'es' }
    ]
  },
  {
    id: 't-need-4',
    name: 'template_help',
    category: 'needs',
    pictograms: [
      { id: '2415', arasaac_id: '2415', keyword: 'necesito', language: 'es' },
      { id: '2417', arasaac_id: '2417', keyword: 'ayuda', language: 'es' }
    ]
  },
  // EMOCIONES
  {
    id: 't-emo-1',
    name: 'template_happy',
    category: 'emotions',
    pictograms: [
      { id: '3437', arasaac_id: '3437', keyword: 'estoy', language: 'es' },
      { id: '2420', arasaac_id: '2420', keyword: 'feliz', language: 'es' }
    ]
  },
  {
    id: 't-emo-2',
    name: 'template_sad',
    category: 'emotions',
    pictograms: [
      { id: '3437', arasaac_id: '3437', keyword: 'estoy', language: 'es' },
      { id: '2421', arasaac_id: '2421', keyword: 'triste', language: 'es' }
    ]
  },
  {
    id: 't-emo-3',
    name: 'template_angry',
    category: 'emotions',
    pictograms: [
      { id: '3437', arasaac_id: '3437', keyword: 'estoy', language: 'es' },
      { id: '2422', arasaac_id: '2422', keyword: 'enojado', language: 'es' }
    ]
  },
  {
    id: 't-emo-4',
    name: 'template_tired',
    category: 'emotions',
    pictograms: [
      { id: '3437', arasaac_id: '3437', keyword: 'estoy', language: 'es' },
      { id: '2423', arasaac_id: '2423', keyword: 'cansado', language: 'es' }
    ]
  }
];
