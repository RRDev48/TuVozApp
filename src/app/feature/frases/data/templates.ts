import { Pictogram } from "../../expresate/models/pictogram.types";

export interface Template {
  id: string;
  name: string; // Key de traducción
  category: 'greetings' | 'needs' | 'emotions';
  pictograms: Partial<Pictogram>[];
}

export const PREDEFINED_TEMPLATES: Template[] = [
  // SALUDOS e INTERACCIÓN
  {
    id: 't-greet-1',
    name: 'template_hello',
    category: 'greetings',
    pictograms: [
      { id: 'ad96fee0-aec5-4b36-adc2-3c2772740aa8', arasaac_id: '6009', keyword: 'hola', language: 'es' }
    ]
  },
  {
    id: 't-greet-2',
    name: 'template_thanks',
    category: 'greetings',
    pictograms: [
      { id: '6665805e-7469-45ee-bef7-2277a77bae77', arasaac_id: '8129', keyword: 'gracias', language: 'es' }
    ]
  },
  {
    id: 't-greet-3',
    name: 'template_please_wait',
    category: 'greetings',
    pictograms: [
      { id: 'afe0924f-a5cc-4a62-acf6-9046b10f1584', arasaac_id: '8195', keyword: 'por favor', language: 'es' },
      { id: 'e1437844-979b-41b9-b67f-ef8d4ae5e5a2', arasaac_id: '16091', keyword: 'espera', language: 'es' }
    ]
  },
  {
    id: 't-greet-4',
    name: 'template_welcome',
    category: 'greetings',
    pictograms: [
      { id: '701543fd-0e52-4c44-8f20-d8f7f9dc6128', arasaac_id: '6936', keyword: 'bienvenido', language: 'es' }
    ]
  },

  // NECESIDADES
  {
    id: 't-need-1',
    name: 'template_i_want_eat',
    category: 'needs',
    pictograms: [
      { id: 'ee9ee166-f7b6-4435-9ccc-ae3e29448d03', arasaac_id: '2617', keyword: 'yo', language: 'es' },
      { id: 'e71167ae-a38d-4bfd-b23f-711ca3cf0290', arasaac_id: '2349', keyword: 'comer', language: 'es' }
    ]
  },
  {
    id: 't-need-2',
    name: 'template_i_want_drink',
    category: 'needs',
    pictograms: [
      { id: 'ee9ee166-f7b6-4435-9ccc-ae3e29448d03', arasaac_id: '2617', keyword: 'yo', language: 'es' },
      { id: '00dc08f0-a8cd-44dd-8e34-0c2f2a0e6102', arasaac_id: '2276', keyword: 'beber', language: 'es' }
    ]
  },
  {
    id: 't-need-3',
    name: 'template_hungry',
    category: 'needs',
    pictograms: [
      { id: 'e8977627-b799-4e3f-b99a-e817a9e53f61', arasaac_id: '35559', keyword: 'tengo hambre', language: 'es' }
    ]
  },
  {
    id: 't-need-4',
    name: 'template_i_want_play',
    category: 'needs',
    pictograms: [
      { id: 'ee9ee166-f7b6-4435-9ccc-ae3e29448d03', arasaac_id: '2617', keyword: 'yo', language: 'es' },
      { id: '69c7d42a-f41c-41ca-bdde-4fecca9a63a4', arasaac_id: '2439', keyword: 'jugar', language: 'es' }
    ]
  },
  {
    id: 't-need-5',
    name: 'template_i_want_go',
    category: 'needs',
    pictograms: [
      { id: 'ee9ee166-f7b6-4435-9ccc-ae3e29448d03', arasaac_id: '2617', keyword: 'yo', language: 'es' },
      { id: 'a70b1bfc-f3e1-47e5-96b4-9ec85be031e1', arasaac_id: '2432', keyword: 'ir', language: 'es' }
    ]
  },

  // EMOCIONES Y SALUD
  {
    id: 't-emo-1',
    name: 'template_head_hurts',
    category: 'emotions',
    pictograms: [
      { id: 'e82c4676-4751-4e9e-9bc9-defc5b3f156a', arasaac_id: '2367', keyword: 'me duele', language: 'es' },
      { id: '41781915-62e8-4746-818e-c4063102984c', arasaac_id: '2673', keyword: 'cabeza', language: 'es' }
    ]
  },
  {
    id: 't-emo-2',
    name: 'template_tired',
    category: 'emotions',
    pictograms: [
      { id: '5abdb005-948f-45e1-9e04-cea6429a02ad', arasaac_id: '2314', keyword: 'estoy cansado', language: 'es' }
    ]
  },
  {
    id: 't-emo-3',
    name: 'template_sick',
    category: 'emotions',
    pictograms: [
      { id: 'ecb567f3-5f33-4713-b24b-7ff4e93c9966', arasaac_id: '7040', keyword: 'estoy enfermo', language: 'es' }
    ]
  },
  {
    id: 't-emo-4',
    name: 'template_hot',
    category: 'emotions',
    pictograms: [
      { id: 'dcc5405b-42e1-4e8a-a978-efa02d33a9a5', arasaac_id: '35561', keyword: 'tengo calor', language: 'es' }
    ]
  },
  {
    id: 't-emo-5',
    name: 'template_i_see_dog',
    category: 'emotions',
    pictograms: [
      { id: 'ee9ee166-f7b6-4435-9ccc-ae3e29448d03', arasaac_id: '2617', keyword: 'yo', language: 'es' },
      { id: '63e4a442-dad9-4203-9339-282f9516db7b', arasaac_id: '2474', keyword: 'ver', language: 'es' },
      { id: '6168aa5a-ec84-4ae6-bcce-71b745b0eddc', arasaac_id: '2517', keyword: 'perro', language: 'es' }
    ]
  }
];
